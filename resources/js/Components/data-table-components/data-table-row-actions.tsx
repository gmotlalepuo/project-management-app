import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/Components/ui/alert-dialog";
import * as React from "react";
import {
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onView: (row: Row<TData>) => void;
  onEdit: (row: Row<TData>) => void;
  onDelete: (row: Row<TData>) => void;
  deleteConfirmationText?: string;
  deleteButtonText?: string;
}

export function DataTableRowActions<TData>({
  row,
  onView,
  onEdit,
  onDelete,
  deleteConfirmationText = "Are you sure you want to delete this item? This action cannot be undone.",
  deleteButtonText = "Delete",
}: DataTableRowActionsProps<TData>) {
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => onView(row)}>View</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(row)}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDialogOpen(true)}>
            {deleteButtonText}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle className="text-lg font-semibold">
            Confirm Deletion
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {deleteConfirmationText}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(row);
                setDialogOpen(false);
              }}
            >
              {deleteButtonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
