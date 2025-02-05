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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

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
    const { active } = event;

    // Only handle task dragging
    for (const column of columns) {
      const task = column.tasks.find((t) => t.id === Number(active.id));
      if (task) {
        setActiveTask(task);
        setStartingColumn(column.id);
        break;
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!event.over || !startingColumn || !activeTask) {
      resetDragState();
      return;
    }

    const newColumnId = Number(event.over.id);

    if (startingColumn !== newColumnId) {
      try {
        router.post(
          route("kanban.move-task", activeTask.id),
          { column_id: newColumnId },
          { preserveScroll: true },
        );
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to move task. Please try again.",
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
  };

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="mx-auto w-full">
        <Tabs defaultValue={columns[0]?.id.toString()} className="w-full">
          <TabsList className="mb-4 grid h-full grid-cols-2 gap-2 sm:grid-cols-3">
            {columns.map((column) => (
              <TabsTrigger
                key={column.id}
                value={column.id.toString()}
                className="w-full px-3 py-2"
              >
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={cn(
                      "h-2 w-2 flex-shrink-0 rounded-full",
                      column.color ? `bg-${column.color}-500` : "bg-secondary",
                    )}
                  />
                  <span className="truncate">{column.name}</span>
                  <span className="flex-shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs">
                    {column.tasks?.length || 0}
                  </span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {columns.map((column) => (
            <TabsContent
              key={column.id}
              value={column.id.toString()}
              className="mt-0 w-full"
            >
              <KanbanColumn
                column={column}
                permissions={permissions}
                projectId={projectId}
                columns={columns}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 md:p-1">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            permissions={permissions}
            projectId={projectId}
            columns={columns}
            isOver={activeTask !== null && startingColumn !== column.id}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && (
          <TaskCard
            task={activeTask}
            permissions={permissions}
            isDragging
            columns={columns}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
