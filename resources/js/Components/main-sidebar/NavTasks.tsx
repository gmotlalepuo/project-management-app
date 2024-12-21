import { Eye, MoreHorizontal, Pencil, Trash2, UserMinus } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Badge } from "@/Components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/Components/ui/sidebar";
import { Label } from "@/types/task";

type TaskWithPermissions = {
  id: number;
  name: string;
  url: string;
  labels: Label[];
  permissions: {
    canDelete: boolean;
  };
};

const truncateText = (text: string, maxLength: number = 7) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export function NavTasks({ tasks }: { tasks: TaskWithPermissions[] }) {
  const { isMobile } = useSidebar();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  if (tasks.length === 0) {
    return null;
  }

  const handleDeleteClick = (taskId: string) => {
    showConfirmation({
      title: "Confirm Task Deletion",
      description:
        "Are you sure you want to delete this task? This action cannot be undone.",
      action: () => router.delete(route("task.destroy", taskId)),
      actionText: "Delete",
    });
  };

  const handleUnassignClick = (taskId: string) => {
    showConfirmation({
      title: "Confirm Task Unassignment",
      description: "Are you sure you want to unassign yourself from this task?",
      action: () =>
        router.post(route("task.unassign", taskId), {
          preserveScroll: true,
        }),
      actionText: "Unassign",
    });
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Tasks</SidebarGroupLabel>
      <SidebarMenu>
        {tasks.map((item, index) => (
          <SidebarMenuItem key={`${item.name}-${index}`}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                {item.labels.slice(0, 1).map((label) => (
                  <Badge
                    key={label.id}
                    variant={label.variant}
                    size="small"
                    className="mr-1"
                  >
                    {truncateText(label.name)}
                  </Badge>
                ))}
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onSelect={() => router.get(item.url)}>
                  <Eye className="h-4 w-4" />
                  <span>View Task</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    router.get(route("task.edit", item.url.split("/").pop()))
                  }
                >
                  <Pencil className="h-4 w-4" />
                  <span>Edit Task</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => handleUnassignClick(item.url.split("/").pop()!)}
                >
                  <UserMinus className="h-4 w-4" />
                  <span>Unassign</span>
                </DropdownMenuItem>

                {item.permissions.canDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500"
                      onSelect={() => handleDeleteClick(item.url.split("/").pop()!)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Task</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href={route("task.index")}>
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>More</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <ConfirmationDialog />
    </SidebarGroup>
  );
}
