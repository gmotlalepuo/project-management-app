import { MoreHorizontal, Trash2 } from "lucide-react";
import { Link, router } from "@inertiajs/react";
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

export function NavTasks({
  tasks,
}: {
  tasks: {
    name: string;
    url: string;
    labels: Label[];
  }[];
}) {
  const { isMobile } = useSidebar();

  if (tasks.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Tasks</SidebarGroupLabel>
      <SidebarMenu>
        {tasks.map((item, index) => (
          <SidebarMenuItem key={`${item.name}-${index}`}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                {item.labels.map((label) => (
                  <Badge key={label.id} variant={label.variant} size="small">
                    {label.name}
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
                  <span>View Task</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    router.get(route("task.edit", item.url.split("/").pop()))
                  }
                >
                  <span>Edit Task</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    router.delete(
                      route("task.destroy", item.url.split("/").pop()),
                    )
                  }
                >
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Task</span>
                </DropdownMenuItem>
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
    </SidebarGroup>
  );
}
