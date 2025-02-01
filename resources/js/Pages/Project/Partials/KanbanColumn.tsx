import { useDroppable } from "@dnd-kit/core";
import { KanbanColumn as KanbanColumnType } from "@/types/kanban";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";

type Props = {
  column: KanbanColumnType;
  permissions: {
    canManageTasks: boolean;
    canManageBoard: boolean;
  };
  isOver?: boolean;
};

export function KanbanColumn({ column, permissions, isOver }: Props) {
  const { setNodeRef, isOver: dropIsOver } = useDroppable({
    id: column.id,
  });

  const showOutline = isOver || dropIsOver;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex h-full w-80 flex-shrink-0 flex-col rounded-lg bg-muted p-2",
        showOutline && "ring-2 ring-primary ring-offset-2",
      )}
    >
      <div className="mb-3 flex items-center justify-between p-2">
        <h3 className="font-semibold">{column.name}</h3>
        <span className="rounded-full bg-background px-2 py-1 text-xs">
          {column.tasks.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} permissions={permissions} />
        ))}
      </div>
    </div>
  );
}
