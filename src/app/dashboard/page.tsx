"use client";
import { useRouter } from "next/navigation";
import { Button, Title, Text, Loader, Paper } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { IconPlus } from "@tabler/icons-react";
import {
  authAtom,
  deleteListModalAtom,
  editListModalAtom,
  listAtom,
} from "../atoms/atoms";
import { api } from "~/trpc/react";
import List from "../_components/list";
import CreateListModal from "../_components/modals/createListModal";
import { useDisclosure } from "@mantine/hooks";
import AddListPlaceHolder from "./addListPlaceHolder";
import DeleteListModal from "../_components/modals/deleteListModal";
import EditListModal from "../_components/modals/editListModal";

export default function Dashboard() {
  const router = useRouter();
  const [auth, setAuth] = useAtom(authAtom);
  const [lists, setLists] = useAtom(listAtom);
  const [deleteListAtom, setDeleteListAtom] = useAtom(deleteListModalAtom);
  const [editListAtom, setEditListAtom] = useAtom(editListModalAtom);
  const [
    isCreateListModalOpen,
    { open: openCreateListModal, close: closeCreateListModal },
  ] = useDisclosure(false);

  const firstRender = useRef(true);

  // Fetch the list using TRPC query
  const { data, isLoading, isError, error } = api.list.all.useQuery(auth.id);

  const handleLogout = () => {
    setAuth({ email: "", id: "", isAuthenticated: false });
    router.push("/login");
  };

  // Check if the user is authenticated, and redirect if not
  useEffect(() => {
    if (firstRender) {
      firstRender.current = false;
      return;
    }

    if (!auth.isAuthenticated) {
      router.push("/login");
    }
  }, [auth.isAuthenticated, router]);

  useEffect(() => {
    if (!isError && !isLoading && data) {
      console.log(data);
      setLists([...data]);
    }
  }, [isLoading]);

  return (
    <div className="h-full w-full bg-blue-100">
      <div className="flex items-center justify-between text-center">
        <Title> Welcome to your Dashboard!</Title>
        <Button color="red" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Handle Loading State */}
      {isLoading && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        >
          <Loader size="lg" />
        </div>
      )}

      {/* Handle Error State */}
      {isError && (
        <Text className="text-center text-red-500" mt={20}>
          Failed to load lists: {error.message}
        </Text>
      )}
      <div className="mt-8">
        {/* Render List Data */}
        {lists && lists.length > 0 ? (
          <ul className="flex items-start justify-start gap-4">
            {lists.map((list) => (
              <List list={list} key={list.id} />
            ))}

            <AddListPlaceHolder openCreateListModal={openCreateListModal} />
          </ul>
        ) : (
          !isLoading &&
          !isError && (
            <AddListPlaceHolder openCreateListModal={openCreateListModal} />
          )
        )}
      </div>

      <CreateListModal
        opened={isCreateListModalOpen}
        close={closeCreateListModal}
      />
      <DeleteListModal
        opened={deleteListAtom.isOpen}
        close={() => setDeleteListAtom({ isOpen: false, listId: null })}
      />
      <EditListModal
        opened={editListAtom.isOpen}
        close={() =>
          setEditListAtom({ isOpen: false, listId: null, list: null })
        }
      />
    </div>
  );
}
