import { useDroppable } from "@dnd-kit/core";
import { KanbanColumn as KanbanColumnType } from "@/types/kanban";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { CirclePlus } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/Components/ui/badge";
import { useViewportHeight } from "@/hooks/use-viewport-height";

type Props = {
  column: KanbanColumnType;
  permissions: {
    canManageTasks: boolean;
    canManageBoard: boolean;
  };
  projectId: number;
  columns: KanbanColumnType[];
  isOver?: boolean;
};

export function KanbanColumn({
  column,
  permissions,
  projectId,
  columns,
  isOver,
}: Props) {
  const { setNodeRef, isOver: dropIsOver } = useDroppable({
    id: column.id,
  });
  const isMobile = useIsMobile();
  const isCompact = useViewportHeight();
  const showOutline = isOver || dropIsOver;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-lg bg-muted p-2 shadow-md",
        isMobile
          ? "mx-auto max-h-[36rem] w-full max-w-2xl"
          : isCompact
            ? "h-80"
            : "h-[65vh] min-w-[300px]",
        showOutline && "ring-2 ring-primary ring-offset-2",
      )}
    >
      <div className="mb-3 flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <Badge variant={column.color}>{column.name}</Badge>
        </div>
        <span className="rounded-full bg-background px-2 py-1 text-xs">
          {column.tasks?.length || 0}
        </span>
      </div>

      <div className="flex min-h-32 flex-1 flex-col gap-2 overflow-y-auto">
        {column.tasks?.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            permissions={permissions}
            columns={columns}
          />
        ))}
      </div>

      {permissions.canManageTasks && (
        <div className="mt-2 px-2">
          <Link
            href={route("task.create", {
              project_id: projectId,
              status_id: column.taskStatus.id,
            })}
            className="w-full"
          >
            <Button variant="ghost" className="w-full justify-start">
              <CirclePlus className="h-4 w-4" />
              Create task
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
