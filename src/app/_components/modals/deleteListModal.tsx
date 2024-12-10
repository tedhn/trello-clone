"use client";

import { Modal, Button, Text } from "@mantine/core";
import { api } from "~/trpc/react"; // Adjust import path for your tRPC setup
import { ModalProps } from "./types";
import { useAtom } from "jotai";
import { deleteListModalAtom, listAtom } from "~/app/atoms/atoms";

const DeleteListModal: React.FC<ModalProps> = ({ close }) => {
  const deleteListMutation = api.list.delete.useMutation();
  const [deleteListAtom] = useAtom(deleteListModalAtom);
  const [_, setList] = useAtom(listAtom);

  const handleDelete = () => {
    deleteListMutation.mutate(
      { id: deleteListAtom.listId! },
      {
        onSuccess: (data) => {
          console.log("List deleted successfully!");

          setList(data);
          close();
        },
        onError: (error) => {
          console.error("Error deleting list:", error);
        },
      },
    );
  };

  return (
    <Modal
      opened={deleteListAtom.isOpen}
      onClose={close}
      title="Delete List"
      centered
    >
      <Text size="sm" my={"md"}>
        Deleting this list will also remove all its tasks. This action cannot be
        undone.
      </Text>
      <div className="mt-4 flex items-center justify-end gap-4">
        <Button onClick={close} variant="default">
          Cancel
        </Button>
        <Button color="red" onClick={() => handleDelete()}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteListModal;
