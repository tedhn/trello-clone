import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HTMLAttributes } from "react";
import ListComponent from "./list";
import { ListWithTasks } from "~/server/types";

type Props = {
  list: ListWithTasks;
  openCreateTaskModal: () => void;
} & HTMLAttributes<HTMLDivElement>;

const SortableList = ({ list, openCreateTaskModal, ...props }: Props) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: list.id,
  });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <ListComponent
        list={list}
        style={styles}
        isOpacityEnabled={isDragging}
        {...props}
        openCreateTaskModal={openCreateTaskModal}
      />
    </div>
  );
};

export default SortableList;
