import { Task } from "@/types/task";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { router } from "@inertiajs/react";
import {
  TASK_PRIORITY_BADGE_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_BADGE_MAP,
} from "@/utils/constants";
import { Link } from "@inertiajs/react";

import { ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";

type TaskHeaderProps = {
  task: Task;
};

export function TaskHeader({ task }: TaskHeaderProps) {
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const handleDelete = () => {
    showConfirmation({
      title: "Delete Task",
      description:
        "Are you sure you want to delete this task? This action cannot be undone.",
      action: () => router.delete(route("task.destroy", task.id)),
      actionText: "Delete",
    });
  };

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm sm:p-6">
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

      <div className="flex flex-col gap-5 md:justify-between lg:flex-row lg:items-center lg:gap-3">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold md:text-2xl">{task.name}</h1>

          <div className="flex gap-2">
            <Badge variant={TASK_STATUS_BADGE_MAP(task.status.slug)}>
              {task.status.name}
            </Badge>
            <Badge variant={TASK_PRIORITY_BADGE_MAP[task.priority]}>
              {TASK_PRIORITY_TEXT_MAP[task.priority]}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Link href={route("task.create", { project_id: task.project_id })}>
            <Button variant="secondary" className="w-full md:w-auto">
              <Plus className="h-3 w-3" />
              <span>New Task</span>
            </Button>
          </Link>
          {task.can.edit && (
            <Link href={route("task.edit", task.id)}>
              <Button variant="outline" className="w-full md:w-auto">
                <Pencil className="h-3 w-3" />
                <span>Edit Task</span>
              </Button>
            </Link>
          )}
          {task.can.delete && (
            <Button
              variant="outline"
              className="w-full text-red-500 md:w-auto"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3" />
              <span>Delete Task</span>
            </Button>
          )}
        </div>
      </div>

      <ConfirmationDialog />
    </div>
  );
}
