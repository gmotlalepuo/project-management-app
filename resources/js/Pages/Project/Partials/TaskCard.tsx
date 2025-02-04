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
  Trash2,
} from "lucide-react";
import { formatDate } from "@/utils/helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useState } from "react";
import { MoveTaskDialog } from "./MoveTaskDialog";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { KanbanColumn } from "@/types/kanban";

type Props = {
  task: Task;
  permissions: {
    canManageTasks: boolean;
    canManageBoard: boolean;
  };
  isDragging?: boolean;
  columns: KanbanColumn[];
};

export function TaskCard({ task, permissions, isDragging = false, columns }: Props) {
  const [isUsingDropdown, setIsUsingDropdown] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const canDragTask = permissions.canManageBoard || task.can.move;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: task,
    disabled: !canDragTask || isUsingDropdown,
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
    showConfirmation({
      title: "Confirm Task Assignment",
      description: "Are you sure you want to assign this task to yourself?",
      action: () =>
        router.post(route("task.assignToMe", task.id), {}, { preserveScroll: true }),
      actionText: "Assign",
    });
  };

  const handleUnassign = () => {
    showConfirmation({
      title: "Confirm Task Unassignment",
      description: "Are you sure you want to unassign yourself from this task?",
      action: () =>
        router.post(route("task.unassign", task.id), {}, { preserveScroll: true }),
      actionText: "Unassign",
    });
  };

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
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...(canDragTask && !isUsingDropdown ? { ...attributes, ...listeners } : {})}
        className={cn(
          "group relative rounded-md border bg-card p-3 shadow-sm hover:border-border",
          canDragTask && !isUsingDropdown && "cursor-grab",
          isDragging && "cursor-grabbing opacity-50",
          !canDragTask && "opacity-80", // Visual indication that task can't be moved
        )}
      >
        <div className="flex items-start justify-between">
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
                    <AvatarFallback>
                      {task.assignedUser.name.charAt(0)}
                    </AvatarFallback>
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

          <div
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
                  <Eye className="h-4 w-4" />
                  <span>View Task</span>
                </DropdownMenuItem>
                {task.can.edit && (
                  <DropdownMenuItem
                    onClick={() => router.visit(route("task.edit", task.id))}
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit Task</span>
                  </DropdownMenuItem>
                )}
                {task.can.assign && (
                  <DropdownMenuItem onClick={handleAssign}>
                    <UserPlus className="h-4 w-4" />
                    <span>Assign to me</span>
                  </DropdownMenuItem>
                )}
                {task.can.unassign && (
                  <DropdownMenuItem onClick={handleUnassign}>
                    <UserMinus className="h-4 w-4" />
                    <span>Unassign</span>
                  </DropdownMenuItem>
                )}
                {task.can.move && (
                  <MoveTaskDialog
                    taskId={task.id}
                    currentColumnId={task.kanban_column_id}
                    columns={columns}
                  />
                )}
                {task.can.delete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Task</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <ConfirmationDialog />
    </>
  );
}
