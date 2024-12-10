import { Checkbox } from "@mantine/core";
import { atom, useAtom } from "jotai";
import React, { useState } from "react";
import { Task } from "~/server/types";
import { taskModal } from "./modals/taskModals";

const TaskComponent: React.FC<{ task: Task }> = ({ task }) => {
  const [checked, setChecked] = useState<boolean>(task.done);

  return (
    <div
      className="flex items-center justify-between rounded-md p-2 hover:bg-slate-400/10"
      onClick={() => taskModal(task)}
    >
      <div>
        <h1 className="">{task.title}</h1>
        <h4 className="text-sm text-slate-400">{task.description}</h4>
      </div>

      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    </div>
  );
};

export default TaskComponent;
