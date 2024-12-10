import {
  Modal,
  TextInput,
  Button,
  Checkbox,
  Group,
  Textarea,
} from "@mantine/core";
import React, { useState, useEffect } from "react";
import { ListWithTasks } from "~/server/types";
import { ModalProps } from "./types";
import { useAtom } from "jotai";
import { editListModalAtom, listAtom } from "~/app/atoms/atoms";
import { api } from "~/trpc/react";

const EditListModal: React.FC<ModalProps> = ({ opened, close }) => {
  const [editListAtom] = useAtom(editListModalAtom);
  const { list } = editListAtom;
  const [lists, setLists] = useAtom(listAtom);
  const [name, setName] = useState(list?.name || "");

  const editListMutation = api.list.update.useMutation();

  const handleSubmit = () => {
    console.log("List ID:", editListAtom.listId);
    console.log("Name:", name);

    const query = {
      id: editListAtom.listId!,
      name,
    };

    editListMutation.mutate(query, {
      onSuccess: (data) => {
        console.log("List updated:", data);

        // Update the list in the listAtom
        const newLists = lists.filter((list) => list.id !== data.id);

        newLists.push(data);
        newLists.sort((a, b) => a.index - b.index);

        setLists(newLists);
        close();
      },
      onError: (error) => {
        console.error("Error deleting list:", error);
      },
    });
  };

  useEffect(() => {
    if (list) {
      setName(list.name);
    }
  }, [editListAtom]);

  return (
    <Modal opened={opened} onClose={close} title="Edit List" centered>
      <TextInput
        label="List Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter the list name"
        required
        mb="sm"
      />

      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save Changes</Button>
      </div>
    </Modal>
  );
};

export default EditListModal;
