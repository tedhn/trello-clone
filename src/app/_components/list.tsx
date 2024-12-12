import React, { HTMLAttributes } from "react";
import {
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useAtom } from "jotai";
import { ActionIcon, Button, Menu, Paper, rem } from "@mantine/core";
import { Task } from "@prisma/client";
import { ListWithTasks } from "~/server/types";
import { deleteListModalAtom, editListModalAtom } from "../atoms/atoms";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableTask from "./draggableTask";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  list: ListWithTasks;
  openCreateTaskModal: () => void;
} & HTMLAttributes<HTMLDivElement>;

const ListComponent: React.FC<Props> = ({
  list,

  openCreateTaskModal,
}) => {
  const { tasks } = list;
  const [_, setDeleteListAtom] = useAtom(deleteListModalAtom);
  const [__, setEditListAtom] = useAtom(editListModalAtom);

  const { setNodeRef, isOver, over } = useDroppable({
    id: list.id,
    data: {
      listId: list.id,
    },
  });

  return (
    <SortableContext
      id={list.id}
      items={tasks}
      strategy={verticalListSortingStrategy}
    >
      <Paper
        className="flex h-full w-80 flex-none flex-col items-center justify-start shadow-lg"
        p="md"
        radius="md"
        ref={setNodeRef}
      >
        <div className="flex w-full items-center justify-between">
          <h1 className="p-2">{list.name}</h1>

          <Menu shadow="md" offset={16}>
            <Menu.Target>
              <ActionIcon
                variant="white"
                color="black"
                aria-label="menu"
                radius="md"
                className="size-3"
              >
                <IconDotsVertical style={{ width: "60%", height: "60%" }} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                color="green"
                leftSection={
                  <IconEdit style={{ width: rem(14), height: rem(14) }} /> // Use an edit icon
                }
                className="text-sm"
                onClick={() =>
                  setEditListAtom({
                    isOpen: true,
                    listId: list.id,
                    list: list,
                  })
                }
              >
                Edit list
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={
                  <IconTrash style={{ width: rem(14), height: rem(14) }} />
                }
                className="text-sm"
                onClick={() =>
                  setDeleteListAtom({ isOpen: true, listId: list.id })
                }
              >
                Delete list
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>

        {/* <Divider /> */}
        {/* </div> */}

        <div className="w-full flex-grow py-4 pb-2">
          {tasks.length !== 0 ? (
            tasks.map((task: Task) => (
              <DraggableTask task={task} key={task.id} />
            ))
          ) : (
            <p className="my-auto text-center text-sm text-slate-400">
              {isOver ? "" : "No tasks yet"}
            </p>
          )}
        </div>

        <Button
          leftSection={<IconPlus />}
          variant="subtle"
          className="mb-0 w-full"
          onClick={openCreateTaskModal}
        >
          Add Task
        </Button>
      </Paper>
    </SortableContext>
  );
};

export default ListComponent;
