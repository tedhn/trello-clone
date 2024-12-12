import { Button, Modal, TextInput, Textarea } from "@mantine/core";
import { useAtom } from "jotai";
import { useState } from "react";

import { authAtom, createTaskModalAtom, listAtom } from "~/app/atoms/atoms"; // Assuming taskAtom is where tasks are stored
import { api } from "~/trpc/react";
import { ModalProps } from "./types";
import { ListWithTasks } from "~/server/types";

const CreateTaskModal: React.FC<ModalProps> = ({ opened, close }) => {
  const createTaskMutation = api.task.create.useMutation(); // tRPC mutation hook
  const [auth] = useAtom(authAtom);
  const [newTaskQuery, setNewTaskQuery] = useState({
    title: "",
    description: "",
  });
  const [lists] = useAtom(listAtom);
  const [createTaskModal] = useAtom(createTaskModalAtom);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateTask = async () => {
    if (auth) {
      const task = await createTaskMutation.mutateAsync({
        title,
        description,
        listId: createTaskModal.listId!,
        userId: auth.id,
      });

      if (task) {
        const list = lists.filter(
          (list) => list.id === createTaskModal.listId,
        )[0]!;

        const newList: ListWithTasks = {
          ...list,
          tasks: [...list.tasks, task],
        };

        lists[newList.index] = newList;

        setNewTaskQuery({ title: "", description: "" });
        close();
      }
    }
  };

  return (
    <Modal opened={opened} onClose={close} title="Create New Task" centered>
      <TextInput
        label="Task Title"
        placeholder="Enter task title"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        required
        className="mb-4 mt-4"
      />
      <Textarea
        label="Description"
        placeholder="Enter task description"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className="mb-8 mt-4"
      />
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button onClick={handleCreateTask}>Create</Button>
      </div>
    </Modal>
  );
};

export default CreateTaskModal;
