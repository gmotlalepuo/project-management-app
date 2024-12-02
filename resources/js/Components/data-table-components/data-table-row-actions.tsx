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
import { Eye, Pencil, Trash2, UserPlus, UserMinus, LogOut } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
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
  onView?: (row: Row<TData>) => void;
  onEdit?: (row: Row<TData>) => void;
  onDelete?: (row: Row<TData>) => void;
  onAssign?: (row: Row<TData>) => void;
  onUnassign?: (row: Row<TData>) => void;
  onLeave?: (row: Row<TData>) => void;
  canEdit?: boolean;
  isProjectTable?: boolean;
  isCreator?: boolean;
}

export function DataTableRowActions<TData>({
  row,
  onView,
  onEdit,
  onDelete,
  onAssign,
  onUnassign,
  onLeave,
  canEdit = true,
  isProjectTable = false,
  isCreator = false,
}: DataTableRowActionsProps<TData>) {
  const { auth } = usePage<PageProps>().props;
  const task = row.original as any;
  const [dialogConfig, setDialogConfig] = React.useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
    actionText: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
    actionText: "",
  });

  // Handle different data shapes for project tasks and global tasks
  const assignedUserId = task.assigned_user_id ?? task.assignedUser?.id;
  const canBeAssigned = !assignedUserId;
  const isAssignedToCurrentUser = assignedUserId === auth.user.id;

  const handleDeleteClick = () => {
    setDialogConfig({
      isOpen: true,
      title: "Confirm Task Deletion",
      description:
        "Are you sure you want to delete this task? This action cannot be undone.",
      action: () => onDelete?.(row),
      actionText: "Delete",
    });
  };

  const handleAssignClick = () => {
    setDialogConfig({
      isOpen: true,
      title: "Confirm Task Assignment",
      description: "Are you sure you want to assign this task to yourself?",
      action: () => onAssign?.(row),
      actionText: "Assign",
    });
  };

  const handleUnassignClick = () => {
    setDialogConfig({
      isOpen: true,
      title: "Confirm Task Unassignment",
      description: "Are you sure you want to unassign yourself from this task?",
      action: () => onUnassign?.(row),
      actionText: "Unassign",
    });
  };

  const handleLeaveClick = () => {
    setDialogConfig({
      isOpen: true,
      title: "Confirm Project Leave",
      description: "Are you sure you want to leave this project?",
      action: () => onLeave?.(row),
      actionText: "Leave",
    });
  };

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
          {onView && (
            <DropdownMenuItem onClick={() => onView(row)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
          )}

          {canEdit && onEdit && (
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}

          {!isProjectTable && (
            <>
              {canBeAssigned && onAssign && (
                <DropdownMenuItem onClick={handleAssignClick}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign to me
                </DropdownMenuItem>
              )}

              {isAssignedToCurrentUser && onUnassign && (
                <DropdownMenuItem onClick={handleUnassignClick}>
                  <UserMinus className="mr-2 h-4 w-4" />
                  Unassign
                </DropdownMenuItem>
              )}
            </>
          )}

          {isProjectTable && !isCreator && onLeave && (
            <DropdownMenuItem onClick={handleLeaveClick}>
              <LogOut className="mr-2 h-4 w-4" />
              Leave Project
            </DropdownMenuItem>
          )}

          {((isProjectTable && isCreator) || (!isProjectTable && canEdit)) &&
            onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isProjectTable && isCreator ? "Delete Project" : "Delete"}
                </DropdownMenuItem>
              </>
            )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={dialogConfig.isOpen}
        onOpenChange={(open) =>
          setDialogConfig((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogTitle>{dialogConfig.title}</AlertDialogTitle>
          <AlertDialogDescription>{dialogConfig.description}</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDialogConfig((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                dialogConfig.action();
                setDialogConfig((prev) => ({ ...prev, isOpen: false }));
              }}
            >
              {dialogConfig.actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
