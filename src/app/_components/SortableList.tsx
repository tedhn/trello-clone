import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HTMLAttributes } from "react";
import ListComponent from "./list";
import { ListWithTasks } from "~/server/types";

type Props = {
  list: ListWithTasks;
} & HTMLAttributes<HTMLDivElement>;

const SortableList = ({ list, ...props }: Props) => {
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
      />
    </div>
  );
};

export default SortableList;
