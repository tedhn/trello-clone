import { Checkbox } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Task } from "~/server/types";
import { taskModal } from "./modals/taskModals";
import { api } from "~/trpc/react";

const TaskComponent: React.FC<{ task: Task }> = ({ task }) => {
  const [checked, setChecked] = useState<boolean>(task.done);
  const updateTaskMutation = api.task.update.useMutation();

  return (
    <div className="mb-2 flex h-full w-full items-center justify-between rounded-md border-2 border-slate-300 bg-white p-2 hover:bg-slate-400/10">
      <div>
        <h1 className="">{task.title}</h1>
        <h4 className="text-sm text-slate-400">{task.description}</h4>
      </div>

      <Checkbox
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          setChecked(e.target.checked);
          updateTaskMutation.mutate({
            listId: task.listId,
            taskId: task.id,
            done: e.target.checked,
          });
        }}
      />
    </div>
  );
};

export default TaskComponent;
