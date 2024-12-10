import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const listRouter = createTRPCRouter({
  all: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.list.findMany({
      where: {
        userId: input,
      },
    });
  }),
});
