import { Text, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Task } from "~/server/types";

export const taskModal = (task: Task) => {
  const task2 = {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    done: false,
    listId: 1,
  };

  return modals.open({
    title: (
      <div>
        {task.title}

        <p>in {task.listId}</p>
      </div>
    ),
    children: (
      <Text size="sm">
        This action is so important that you are required to confirm it with a
        modal. Please click one of these buttons to proceed.
      </Text>
    ),
    radius: "md",
    size: "xl",
    // labels: { confirm: "Confirm", cancel: "Cancel" },
    // onCancel: () => console.log("Cancel"),
    // onConfirm: () => console.log("Confirmed"),
  });
};
