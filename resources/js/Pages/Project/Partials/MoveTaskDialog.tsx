import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { MoveRight } from "lucide-react";
import { KanbanColumn } from "@/types/kanban";
import { cn } from "@/lib/utils";

type Props = {
  taskId: number;
  currentColumnId: number;
  columns: KanbanColumn[];
};

export function MoveTaskDialog({ taskId, currentColumnId, columns }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");

  const handleMove = () => {
    if (!selectedColumnId) return;

    router.post(
      route("kanban.move-task", taskId),
      { column_id: selectedColumnId },
      {
        preserveScroll: true,
        onSuccess: () => setOpen(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative flex w-full select-none items-center justify-start gap-2 rounded-sm px-2 py-1.5 text-sm"
        >
          <MoveRight className="h-4 w-4" />
          <span>Move</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Select value={selectedColumnId} onValueChange={setSelectedColumnId}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {columns
                .filter((col) => col.id !== currentColumnId)
                .map((column) => (
                  <SelectItem key={column.id} value={column.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          column.color ? `bg-${column.color}-500` : "bg-secondary",
                        )}
                      />
                      {column.name}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMove} disabled={!selectedColumnId}>
              Move Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
