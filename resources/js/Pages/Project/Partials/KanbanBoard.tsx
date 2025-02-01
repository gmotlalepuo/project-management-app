import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
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
import { useToast } from "@/hooks/use-toast";

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
  const [startingColumn, setStartingColumn] = useState<number | null>(null);
  const [activeColumn, setActiveColumn] = useState<number | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        delay: 0,
        tolerance: 1,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (!event.active) return;

    // Find task in columns
    for (const column of columns) {
      const task = column.tasks.find((t) => t.id === event.active.id);
      if (task) {
        setActiveTask(task);
        setStartingColumn(column.id);
        break;
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) {
      setActiveColumn(null);
      return;
    }
    setActiveColumn(Number(event.over.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!event.over || !startingColumn) {
      resetDragState();
      return;
    }

    const newColumnId = event.over.id as number;

    if (startingColumn !== newColumnId) {
      try {
        router.post(
          route("kanban.move-task", event.active.id),
          { column_id: newColumnId },
          { preserveScroll: true },
        );
      } catch (error) {
        toast({
          title: "Error moving task",
          description: "The task could not be moved. Please try again.",
          variant: "destructive",
        });
      }
    }

    resetDragState();
  };

  const handleDragCancel = () => {
    resetDragState();
  };

  const resetDragState = () => {
    setActiveTask(null);
    setStartingColumn(null);
    setActiveColumn(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto p-1">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            permissions={permissions}
            isOver={activeColumn === column.id}
          />
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
