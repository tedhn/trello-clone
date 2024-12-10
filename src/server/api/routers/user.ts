import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
          password: input.password,
        },
      });

      if (user) {
        return { email: user.email, id: user.id, isAuthenticated: true };
      } else {
        return { email: "", id: "", isAuthenticated: false };
      }
    }),
});
