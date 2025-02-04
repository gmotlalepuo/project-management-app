import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { KanbanColumn } from "@/types/kanban";
import { cn } from "@/lib/utils";

type SortableItemProps = {
  id: number;
  children: React.ReactNode;
};

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex cursor-grab items-center gap-2 rounded-md border bg-card p-3 active:cursor-grabbing"
    >
      <DragHandleDots2Icon className="h-5 w-5" />
      {children}
    </div>
  );
}

type Props = {
  columns: KanbanColumn[];
  projectId: number;
};

export function ReorderColumnsDialog({ columns: initialColumns, projectId }: Props) {
  const [columns, setColumns] = useState(initialColumns);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setColumns((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleSave = () => {
    const updatedColumns = columns.map((col, index) => ({
      id: col.id,
      order: index,
    }));

    router.post(
      route("kanban.update-columns-order", projectId),
      { columns: updatedColumns },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => {
          setOpen(false);
          toast({
            title: "Success",
            description: "Column order updated successfully",
            variant: "success",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update column order",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <DragHandleDots2Icon className="h-4 w-4" />
          Reorder Columns
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reorder Kanban Columns</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={columns} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {columns.map((column) => (
                  <SortableItem key={column.id} id={column.id}>
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        column.color ? `bg-${column.color}-500` : "bg-secondary",
                      )}
                    />
                    <span>{column.name}</span>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Order</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
