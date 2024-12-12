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

      const index = await ctx.db.task
        .findMany({
          where: {
            listId: input.listId,
          },
        })
        .then((res) => {
          return res.length;
        });

      // Create the task in the database
      const task = await ctx.db.task.create({
        data: {
          title,
          description: description || "",
          index,
          List: {
            connect: { id: listId, userId: input.userId }, // Linking the task to an existing list
          },
        },
      });

      return task;
    }),

  update: publicProcedure
    .input(
      z.object({
        taskId: z.string(),
        listId: z.string().optional(),
        index: z.number().optional(),
        done: z.boolean().optional(), // New done status (optional)
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { taskId, listId, index, done } = input;

      // Find the task within the given list
      const task = await ctx.db.task.findFirst({
        where: {
          id: taskId,
        },
      });

      // If the task is not found, throw an error
      if (!task) {
        throw new Error("Task not found");
      }

      // Update the task's index and 'done' status
      const updatedTask = await ctx.db.task.update({
        where: { id: task.id }, // Update task by its ID
        data: { listId: listId }, // Data to be updated
      });

      // Return the updated task
      return updatedTask;
    }),
});
