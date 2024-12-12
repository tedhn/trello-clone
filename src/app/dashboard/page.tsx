"use client";
import { useRouter } from "next/navigation";
import { Button, Title, Text, Loader, Paper } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import {
  authAtom,
  createTaskModalAtom,
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
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { ListWithTasks } from "~/server/types";
import SortableList from "../_components/SortableList";
import CreateTaskModal from "../_components/modals/createTaskModal";

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
  const [createTaskAtom, setCreateTaskAtom] = useAtom(createTaskModalAtom);

  // for input methods detection
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
  );
  const [draggingList, setDraggingList] = useState<ListWithTasks | null>(null);

  const swapIndexMutation = api.list.swapIndex.useMutation();
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

  // triggered when dragging starts
  const handleDragStart = (event: DragStartEvent) => {
    console.log("starting drag");

    const { active } = event;

    const currentList = lists.filter((list) => list.id === active.id)[0]!;

    console.log(currentList);
    setDraggingList(currentList);
  };

  // triggered when dragging ends
  const handleDragEnd = (event: DragEndEvent) => {
    console.log("ending drag");
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = lists.findIndex((list) => list.id === active.id);
      const newIndex = lists.findIndex((list) => list.id === over?.id);

      swapIndexMutation.mutate(
        { userId: auth.id, id: draggingList!.id, index: newIndex },
        {
          onSuccess: (data) => {
            console.log("List created:", data);
            setLists((lists) => {
              return arrayMove(lists!, oldIndex, newIndex);
            });
            setDraggingList(null);
          },
          onError: (error) => {
            console.error("Error creating list:", error);
          },
        },
      );
    }
  };

  const handleDragCancel = () => {
    setDraggingList(null);
  };

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
          <>
            <ul className="flex items-start justify-start gap-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <SortableContext
                  items={lists.map((list) => list.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {lists.map((list) => (
                    <SortableList
                      list={list}
                      key={list.id}
                      openCreateTaskModal={() =>
                        setCreateTaskAtom({ isOpen: true, listId: list.id })
                      }
                    />
                  ))}
                </SortableContext>

                <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
                  {draggingList ? (
                    <List
                      list={draggingList}
                      isDragging
                      openCreateTaskModal={() => {}}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>

              <AddListPlaceHolder openCreateListModal={openCreateListModal} />
            </ul>
          </>
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
      <CreateTaskModal
        opened={createTaskAtom.isOpen}
        close={() => setCreateTaskAtom({ isOpen: false, listId: null })}
      />
    </div>
  );
}
