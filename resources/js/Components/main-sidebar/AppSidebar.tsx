import { ListTodo, SquareChartGantt, Users } from "lucide-react";

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
import NavThemeToggle from "./NavThemeToggle";
import { NavTasks } from "./NavTasks";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { auth, recentProjects, recentTasks } = usePage<PageProps>().props;

  const data = {
    user: {
      name: auth.user.name,
      email: auth.user.email,
      avatar: `/storage/${auth.user.profile_picture}`,
    },
    navMain: [
      {
        title: "Projects",
        url: route("project.index"),
        icon: SquareChartGantt,
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
        url: route("task.index"),
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
    projects: recentProjects.map((project) => ({
      name: project.name,
      url: route("project.show", project.id),
      status: project.status,
    })),
    tasks: recentTasks.map((task) => ({
      name: task.name,
      url: route("task.show", task.id),
      labels: task.labels,
    })),
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavTasks tasks={data.tasks} />
      </SidebarContent>
      <SidebarFooter>
        <NavThemeToggle />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
