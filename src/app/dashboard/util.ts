import { ListWithTasks, Task } from "~/server/types";


export const initializeBoard = (lists: ListWithTasks[]) => {
  const board: { [id: string]: Task[] } = {};

  lists.forEach((list) => {
    const tasks = list.tasks;

    board[list.id] = tasks;
  });

  console.log(board);
  return board;
};
