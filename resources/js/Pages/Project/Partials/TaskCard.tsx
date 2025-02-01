import { useDraggable } from "@dnd-kit/core";
import { Task } from "@/types/task";
import { router } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  Eye,
  MoreHorizontal,
  Pencil,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { formatDate } from "@/utils/helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useState } from "react";

type Props = {
  task: Task;
  permissions: {
    canManageTasks: boolean;
    canManageBoard: boolean;
  };
  isDragging?: boolean;
};

export function TaskCard({ task, permissions, isDragging = false }: Props) {
  const [isUsingDropdown, setIsUsingDropdown] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: task,
    disabled: !permissions.canManageTasks || isUsingDropdown,
  });

  const handleDropdownOpenChange = (open: boolean) => {
    setIsUsingDropdown(open);
  };

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleAssign = () => {
    router.post(
      route("task.assignToMe", task.id),
      {},
      {
        preserveScroll: true,
      },
    );
  };

  const handleUnassign = () => {
    router.post(
      route("task.unassign", task.id),
      {},
      {
        preserveScroll: true,
      },
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(permissions.canManageTasks && !isUsingDropdown
        ? { ...attributes, ...listeners }
        : {})}
      className={cn(
        "group relative rounded-md border bg-card p-3 shadow-sm hover:border-border",
        permissions.canManageTasks && !isUsingDropdown && "cursor-grab",
        isDragging && "cursor-grabbing opacity-50",
      )}
    >
      <div
        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
        onMouseDown={(e) => e.stopPropagation()} // Prevent drag when using dropdown
      >
        <DropdownMenu onOpenChange={handleDropdownOpenChange}>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded p-1 hover:bg-muted"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.visit(route("task.show", task.id))}
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>View Task</span>
            </DropdownMenuItem>
            {permissions.canManageTasks && (
              <DropdownMenuItem
                onClick={() => router.visit(route("task.edit", task.id))}
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit Task</span>
              </DropdownMenuItem>
            )}
            {task.can.assign && (
              <DropdownMenuItem onClick={handleAssign}>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Assign to me</span>
              </DropdownMenuItem>
            )}
            {task.can.unassign && (
              <DropdownMenuItem onClick={handleUnassign}>
                <UserMinus className="mr-2 h-4 w-4" />
                <span>Unassign</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">#{task.task_number}</span>
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
    </div>
  );
}
