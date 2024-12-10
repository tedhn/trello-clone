import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { api } from "~/trpc/server";

export const listRouter = createTRPCRouter({
  all: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    console.log(ctx.db.list);

    return ctx.db.list.findMany({
      where: {
        userId: input,
      },
      orderBy: {
        index: "asc",
      },
      include: {
        tasks: true,
      },
    });
  }),

  create: publicProcedure
    .input(z.object({ name: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const index = await ctx.db.list
        .findMany({
          where: {
            userId: input.userId,
          },
        })
        .then((res) => {
          return res.length;
        });

      return ctx.db.list.create({
        data: {
          name: input.name,
          userId: input.userId,
          tasks: undefined,
          index,
        },
        include: {
          tasks: true,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete the list
      const deletedList = await ctx.db.list.delete({
        where: {
          id: input.id,
        },
        include: {
          tasks: true,
        },
      });

      // Fetch remaining lists ordered by index
      const remainingLists = await ctx.db.list.findMany({
        where: { userId: deletedList.userId },
        orderBy: { index: "asc" },
        include: { tasks: true },
      });

      // Reassign indices to remaining lists
      const sortedList = await Promise.all(
        remainingLists.map((list, newIndex) => {
          console.log(newIndex, list.name);

          return ctx.db.list.update({
            where: { id: list.id },
            data: { index: newIndex }, // Reindex starting from 1
            include: { tasks: true },
          });
        }),
      );

      return sortedList;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(), // The list's unique ID
        name: z.string().optional(), // New name (optional)
        // index: z.number().optional(), // New index (optional)
        // tasks: z
        //   .array(
        //     z.object({
        //       // Array of tasks to be updated (optional)
        //       id: z.string(),
        //       title: z.string().optional(),
        //       description: z.string().optional(),
        //       done: z.boolean().optional(),
        //     }),
        //   )
        //   .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name } = input;
      // Find the existing list
      const existingList = await ctx.db.list.findUnique({
        where: { id },
      });

      if (!existingList) {
        throw new Error("List not found");
      }

      const updatedList = await ctx.db.list.update({
        where: { id },
        data: {
          name: name ?? existingList.name, // If name is provided, update it; otherwise, keep existing
        },
        include: { tasks: true },
      });

      return updatedList;
    }),
});
