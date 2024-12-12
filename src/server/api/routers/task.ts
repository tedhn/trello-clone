import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  // Read: Get a task by ID
  get: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const task = await ctx.db.task.findFirst({
      where: { id: input },
      include: {
        List: true,
      },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }),

  // Create: Create a new task
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        listId: z.string(), // Assuming you want to associate a task with a list
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { title, description, listId } = input;

      // Create the task in the database
      const task = await ctx.db.task.create({
        data: {
          title,
          description: description || "",
          List: {
            connect: { id: listId, userId: input.userId }, // Linking the task to an existing list
          },
        },
      });

      return task;
    }),
});
