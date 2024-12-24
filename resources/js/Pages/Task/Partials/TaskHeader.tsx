import { Task } from "@/types/task";
import { Badge } from "@/Components/ui/badge";
import {
  TASK_PRIORITY_BADGE_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_BADGE_MAP,
  TASK_STATUS_TEXT_MAP,
} from "@/utils/constants";
import { Link } from "@inertiajs/react";

import { ChevronRight } from "lucide-react";
import { Button } from "@/Components/ui/button";

type TaskHeaderProps = {
  task: Task;
};

export function TaskHeader({ task }: TaskHeaderProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-x-3 text-sm text-muted-foreground">
        <Link
          href={route("project.show", task.project.id)}
          className="hover:text-foreground hover:underline"
        >
          {task.project.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>Task #{task.task_number}</span>
      </div>

      <div className="flex items-start justify-between gap-x-3">
        <h1 className="text-xl font-semibold md:text-2xl">{task.name}</h1>

        <div className="flex gap-2">
          <Badge variant={TASK_STATUS_BADGE_MAP[task.status]}>
            {TASK_STATUS_TEXT_MAP[task.status]}
          </Badge>
          <Badge variant={TASK_PRIORITY_BADGE_MAP[task.priority]}>
            {TASK_PRIORITY_TEXT_MAP[task.priority]}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {task.labels?.map((label) => (
          <Badge key={label.id} variant={label.variant}>
            {label.name}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        {task.can.edit && (
          <Link href={route("task.edit", task.id)}>
            <Button variant="outline">Edit Task</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
