"use client";
import { useRouter } from "next/navigation";
import { Button, Title, Text, Loader } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
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
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ListWithTasks, Task } from "~/server/types";
import CreateTaskModal from "../_components/modals/createTaskModal";
import DraggableTask from "../_components/draggableTask";

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
  const [draggingTask, setDragginTask] = useState<Task | null>(null);

  const swapIndexMutation = api.list.swapIndex.useMutation();
  const updateTaskMutation = api.task.update.useMutation();
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
      setLists([...data]);
    }
  }, [isLoading]);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    const containerId = active.data.current?.sortable.containerId;

    const list = lists.filter(
      (item: ListWithTasks) => item.id === containerId,
    )[0]!;

    const task = list.tasks.filter((item: Task) => item.id === id)[0]!;

    setDragginTask(task);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    const { id } = active;

    const prevContainerId = active.data.current?.sortable
      ? active.data.current.sortable.containerId
      : active.data.current?.listId;
    const newContainerId = over?.data.current?.sortable
      ? over.data.current.sortable.containerId
      : over?.data.current?.listId;

    if (
      !prevContainerId ||
      !newContainerId ||
      prevContainerId === newContainerId
    ) {
      return;
    }
    // Find the source and destination lists
    const sourceList = lists.find(
      (item: ListWithTasks) => item.id === prevContainerId,
    )!;
    const destinationList = lists.find(
      (item: ListWithTasks) => item.id === newContainerId,
    )!;

    setLists((prev) => {
      const newList = prev.map((list) => {
        if (list.id === sourceList.id) {
          return {
            ...list,
            tasks: sourceList.tasks.filter((task) => task.id !== id),
          };
        }
        if (list.id === destinationList.id) {
          const newTask = sourceList.tasks.filter((task) => task.id === id)[0]!;

          newTask.listId = destinationList.id;

          return {
            ...list,
            tasks: [...list.tasks, newTask],
          };
        }

        return list;
      });

      return newList;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over!;

    const newContainerId = over?.data.current?.sortable
      ? over.data.current.sortable.containerId
      : over?.data.current?.listId;

    updateTaskMutation.mutate({ listId: newContainerId, taskId: id + "" }, {});
  }

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
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                {lists.map((list) => (
                  <List
                    list={list}
                    key={list.id}
                    openCreateTaskModal={() =>
                      setCreateTaskAtom({ isOpen: true, listId: list.id })
                    }
                  />
                ))}

                <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
                  {draggingTask ? (
                    <DraggableTask
                      task={draggingTask}
                      // isDragging
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
