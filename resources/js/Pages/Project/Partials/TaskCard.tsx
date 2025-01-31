import { useDraggable } from "@dnd-kit/core";
import { Task } from "@/types/task";
import { Link } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { cn } from "@/lib/utils";
import { CalendarClock } from "lucide-react";
import { formatDate } from "@/utils/helpers";

type Props = {
  task: Task;
  permissions: {
    canManageTasks: boolean;
    canManageBoard: boolean;
  };
  isDragging?: boolean;
};

export function TaskCard({ task, permissions, isDragging = false }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: task,
    disabled: !permissions.canManageTasks,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab rounded-md border bg-card p-3 shadow-sm hover:border-border",
        isDragging && "cursor-grabbing",
        !permissions.canManageTasks && "cursor-default",
      )}
    >
      <Link href={route("task.show", task.id)}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              #{task.task_number}
            </span>
            <h4 className="line-clamp-2 flex-1 font-medium">{task.name}</h4>
          </div>

          {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.map((label) => (
                <Badge key={label.id} variant={label.variant}>
                  {label.name}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            {task.assignedUser ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignedUser.profile_picture} />
                  <AvatarFallback>{task.assignedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {task.assignedUser.name}
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Unassigned</span>
            )}

            {task.due_date && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <CalendarClock className="h-4 w-4" />
                <span>{formatDate(task.due_date)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
