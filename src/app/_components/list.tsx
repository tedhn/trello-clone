import React from "react";
import {
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useAtom } from "jotai";
import { ActionIcon, Button, Menu, Paper, rem } from "@mantine/core";
import { Task } from "@prisma/client";
import TaskComponent from "./task";
import { ListWithTasks } from "~/server/types";
import { deleteListModalAtom, editListModalAtom } from "../atoms/atoms";

const ListComponent: React.FC<{ list: ListWithTasks }> = ({ list }) => {
  const { tasks } = list;
  const [_, setDeleteListAtom] = useAtom(deleteListModalAtom);
  const [__, setEditListAtom] = useAtom(editListModalAtom);

  return (
    <Paper
      className="flex h-fit min-h-96 w-64 flex-col items-center justify-start shadow-lg"
      p="md"
      radius="md"
    >
      {/* <div className="w-full"> */}
      <div className="flex w-full items-center justify-between">
        <h1 className="p-2">
          {list.name} + {list.index}
        </h1>

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
                setEditListAtom({ isOpen: true, listId: list.id, list: list })
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

      <section className="w-full flex-grow pb-2">
        <div className="py-4">
          {tasks.length !== 0 ? (
            tasks.map((task: Task) => (
              <TaskComponent task={task} key={task.id} />
            ))
          ) : (
            <p className="my-auto text-center text-sm text-slate-400">
              No tasks
            </p>
          )}
        </div>
      </section>

      <Button
        leftSection={<IconPlus />}
        variant="subtle"
        className="mb-0 w-full"
      >
        Add Task
      </Button>
    </Paper>
  );
};

export default ListComponent;
