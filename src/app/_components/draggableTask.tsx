import React, { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Task } from "~/server/types";
import TaskComponent from "./task";

interface DraggableTaskProps {
  task: Task;
}
const DraggableTask: FC<DraggableTaskProps> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    opacity: isDragging ? 0.2 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // className="h-[50px] w-[100px]"
    >
      <TaskComponent task={task} />
    </div>
  );
};

export default DraggableTask;
