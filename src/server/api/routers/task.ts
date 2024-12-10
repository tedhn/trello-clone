import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  get: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const task = await ctx.db.task.findFirst({
      where: {
        id: input,
      },
      include: {
        List: true,
      },
    });

    return task;
  }),
});
