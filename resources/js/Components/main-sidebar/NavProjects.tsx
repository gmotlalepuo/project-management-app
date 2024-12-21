import {
  Eye,
  LogOut,
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  UsersRound,
} from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { STATUS_CONFIG, type StatusType } from "@/utils/constants";

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

type ProjectWithPermissions = {
  status: StatusType;
  name: string;
  url: string;
  permissions: {
    canEdit: boolean;
    isCreator: boolean;
  };
};

export function NavProjects({ projects }: { projects: ProjectWithPermissions[] }) {
  const { isMobile } = useSidebar();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  if (projects.length === 0 || !projects.some((p) => p.permissions)) {
    return null;
  }

  const handleLeaveClick = (projectId: string) => {
    showConfirmation({
      title: "Confirm Project Leave",
      description: "Are you sure you want to leave this project?",
      action: () =>
        router.post(route("project.leave", { project: projectId }), {
          preserveScroll: true,
        }),
      actionText: "Leave",
    });
  };

  const handleDeleteClick = (projectId: string) => {
    showConfirmation({
      title: "Confirm Project Deletion",
      description:
        "Are you sure you want to delete this project? This action cannot be undone.",
      action: () => router.delete(route("project.destroy", projectId)),
      actionText: "Delete",
    });
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item, index) => {
          const StatusIcon = STATUS_CONFIG[item.status].icon;
          const projectId = item.url.split("/").pop()!;

          return (
            <SidebarMenuItem key={`${item.name}-${index}`} title={item.name}>
              <SidebarMenuButton asChild>
                <Link href={item.url} className="flex items-center gap-2">
                  <span className="shrink-0" title={STATUS_CONFIG[item.status].text}>
                    <StatusIcon
                      className={`h-4 w-4 ${STATUS_CONFIG[item.status].color}`}
                    />
                  </span>
                  <span className="truncate">{item.name}</span>
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
                    <span>View Project</span>
                  </DropdownMenuItem>

                  {item.permissions.canEdit && (
                    <DropdownMenuItem
                      onSelect={() => router.get(route("project.edit", projectId))}
                    >
                      <Pencil className="h-4 w-4" />
                      <span>Edit Project</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onSelect={() =>
                      router.get(route("task.create", { project_id: projectId }))
                    }
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Task</span>
                  </DropdownMenuItem>

                  {item.permissions.canEdit && (
                    <DropdownMenuItem
                      onSelect={() =>
                        router.get(
                          route("project.show", {
                            project: projectId,
                            tab: "invite",
                          }),
                        )
                      }
                    >
                      <UsersRound className="h-4 w-4" />
                      <span>Invite User</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  {item.permissions.isCreator ? (
                    <DropdownMenuItem
                      className="text-red-500"
                      onSelect={() => handleDeleteClick(projectId)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="text-red-500"
                      onSelect={() => handleLeaveClick(projectId)}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Leave Project</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href={route("project.index")}>
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
