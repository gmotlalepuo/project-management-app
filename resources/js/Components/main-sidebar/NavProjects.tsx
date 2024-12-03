import { Eye, LogOut, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

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
import { Badge } from "../ui/badge";
import {
  PROJECT_STATUS_BADGE_MAP,
  PROJECT_STATUS_TEXT_MAP,
} from "@/utils/constants";

type ProjectWithPermissions = {
  status: keyof typeof PROJECT_STATUS_BADGE_MAP;
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
        {projects.map((item, index) => (
          <SidebarMenuItem key={`${item.name}-${index}`}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <Badge
                  className="text-nowrap"
                  size="small"
                  variant={PROJECT_STATUS_BADGE_MAP[item.status]}
                >
                  {PROJECT_STATUS_TEXT_MAP[item.status]}
                </Badge>
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
                  <span>View Project</span>
                </DropdownMenuItem>

                {item.permissions.canEdit && (
                  <DropdownMenuItem
                    onSelect={() =>
                      router.get(route("project.edit", item.url.split("/").pop()))
                    }
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit Project</span>
                  </DropdownMenuItem>
                )}

                {item.permissions.isCreator ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500"
                      onSelect={() => handleDeleteClick(item.url.split("/").pop()!)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500"
                      onSelect={() => handleLeaveClick(item.url.split("/").pop()!)}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Leave Project</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
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
