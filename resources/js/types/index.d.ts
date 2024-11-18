import { User } from "./user";
import { Config } from "ziggy-js";
import { Project } from "./project";
import { Task } from "./task";

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: User;
  };
  ziggy: Config & { location: string };
  projects: Project[];
  recentProjects: Project[];
  recentTasks: Task[];
};
