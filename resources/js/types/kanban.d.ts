import { Task } from "./task";

export type KanbanColumn = {
  id: number;
  name: string;
  order: number;
  project_id: number;
  is_default: boolean;
  maps_to_status: string | null;
  color: string | null;
  tasks: Task[];
};

export type KanbanColumnData = {
  columns: KanbanColumn[];
  project_id: number;
};
