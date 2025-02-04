import { TaskStatusBadgeVariant } from "@/utils/constants";
import { Task } from "./task";

export type KanbanColumn = {
  id: number;
  name: string;
  order: number;
  color: TaskStatusBadgeVariant;
  is_default: boolean;
  tasks: Task[];
  project_id: number;
  taskStatus: {
    id: number;
    name: string;
    slug: string;
    color: string;
  };
};

export type KanbanColumnData = {
  columns: KanbanColumn[];
  project_id: number;
};
