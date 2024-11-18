import { MoreHorizontal, Trash2 } from "lucide-react";
import { Link, router } from "@inertiajs/react";

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

export function NavProjects({
  projects,
}: {
  projects: {
    status: keyof typeof PROJECT_STATUS_BADGE_MAP;
    name: string;
    url: string;
  }[];
}) {
  const { isMobile } = useSidebar();

  if (projects.length === 0) {
    return null;
  }

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
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    router.get(route("project.edit", item.url.split("/").pop()))
                  }
                >
                  <span>Edit Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    router.delete(
                      route("project.destroy", item.url.split("/").pop()),
                    )
                  }
                >
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
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
    </SidebarGroup>
  );
}
