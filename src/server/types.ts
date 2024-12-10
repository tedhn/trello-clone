import { Prisma } from "@prisma/client";

export type ListWithTasks = Prisma.ListGetPayload<{
  include: { tasks: true };
}>;

export type Task = Prisma.TaskGetPayload<{
  // include: { list: true };
}>;
