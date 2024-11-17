import * as React from "react";
import {
  BookOpen,
  Bot,
  Frame,
  ListTodo,
  Map,
  PieChart,
  Settings2,
  SquareChartGantt,
  SquareTerminal,
  Users,
} from "lucide-react";

import { NavMain } from "./NavMain";
import { NavProjects } from "./NavProjects";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/Components/ui/sidebar";
import { NavHeader } from "./NavHeader";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { ModeToggle } from "../ModeToggle";
import NavThemeToggle from "./NavThemeToggle";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = usePage<PageProps>().props.auth.user;

  const data = {
    user: {
      name: user.name,
      email: user.email,
      avatar: `/storage/${user.profile_picture}`,
    },
    navMain: [
      {
        title: "Projects",
        url: "#",
        icon: SquareChartGantt,
        isActive: true,
        items: [
          {
            title: "All Projects",
            url: route("project.index"),
            prefetch: true,
          },
          {
            title: "Invitations",
            url: route("project.invitations"),
            prefetch: true,
          },
        ],
      },
      {
        title: "Tasks",
        url: "#",
        icon: ListTodo,
        items: [
          {
            title: "All Tasks",
            url: route("task.index"),
            prefetch: true,
          },
          {
            title: "My Tasks",
            url: route("task.myTasks"),
            prefetch: true,
          },
        ],
      },
      {
        title: "Users",
        url: route("user.index"),
        icon: Users,
        prefetch: true,
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavThemeToggle />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
