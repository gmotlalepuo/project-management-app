import { useDroppable } from "@dnd-kit/core";
import { KanbanColumn as KanbanColumnType } from "@/types/kanban";
import { TaskCard } from "./TaskCard";

type Props = {
  column: KanbanColumnType;
  permissions: {
    canManageTasks: boolean;
    canManageBoard: boolean;
  };
};

export function KanbanColumn({ column, permissions }: Props) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  // Handle both wrapped and unwrapped data structures
  const tasks = Array.isArray(column.tasks)
    ? column.tasks
    : column.tasks?.data || [];

  return (
    <div
      ref={setNodeRef}
      className="flex h-full w-80 flex-shrink-0 flex-col rounded-lg bg-muted p-2"
    >
      <div className="mb-3 flex items-center justify-between p-2">
        <h3 className="font-semibold">{column.name}</h3>
        <span className="rounded-full bg-background px-2 py-1 text-xs">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} permissions={permissions} />
        ))}
      </div>
    </div>
  );
}
