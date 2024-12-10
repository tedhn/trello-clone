import { Button, Modal, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useState } from "react";

import { authAtom, listAtom } from "~/app/atoms/atoms";
import { api } from "~/trpc/react";
import { ModalProps } from "./types";

const CreateListModal: React.FC<ModalProps> = ({ opened, close }) => {
  const createListMutation = api.list.create.useMutation(); // tRPC mutation hook
  const [auth] = useAtom(authAtom);
  const [_, setLists] = useAtom(listAtom);
  const [name, setName] = useState("");

  const handleCreateList = () => {
    createListMutation.mutate(
      { name, userId: auth.id },
      {
        onSuccess: (data) => {
          console.log("List created:", data);
          setLists((prevLists) => [...prevLists, data]);
          close(); // Close the modal after success
          setName(""); // Reset the input field
        },
        onError: (error) => {
          console.error("Error creating list:", error);
        },
      },
    );
  };

  return (
    <Modal opened={opened} onClose={close} title="Create New List" centered>
      <TextInput
        label="List Name"
        placeholder="Enter list name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        required
        className="mt-4 mb-8"
      />
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button onClick={handleCreateList}>Create</Button>
      </div>
    </Modal>
  );
};

export default CreateListModal;
