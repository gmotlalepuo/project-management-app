import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { KanbanColumn as KanbanColumnType } from "@/types/kanban";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { Task } from "@/types/task";
import { router } from "@inertiajs/react";

type Props = {
  columns: KanbanColumnType[];
  projectId: number;
  permissions: {
    canManageTasks: boolean;
    canManageBoard: boolean;
  };
};

export function KanbanBoard({ columns, projectId, permissions }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    // Ensure we're working with arrays
    const allTasks = columns.reduce<Task[]>((acc, col) => {
      return acc.concat(Array.isArray(col.tasks) ? col.tasks : []);
    }, []);

    const task = allTasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const taskId = active.id;
      const newColumnId = over.id;

      router.post(
        route("kanban.move-task", taskId),
        {
          column_id: newColumnId,
        },
        {
          preserveScroll: true,
        },
      );
    }
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} permissions={permissions} />
        ))}
      </div>
      <DragOverlay>
        {activeTask && (
          <TaskCard task={activeTask} permissions={permissions} isDragging />
        )}
      </DragOverlay>
    </DndContext>
  );
}
