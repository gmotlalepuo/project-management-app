import { TaskLabelBadgeVariant } from "@/utils/constants";
import { PaginationLinks, PaginationMeta } from "./utils";

export type Task = {
  id: number;
  task_number: number; // Add this new field
  name: string;
  description: string;
  created_at: string;
  due_date: string;
  status: "completed" | "pending" | "in_progress";
  priority: "low" | "medium" | "high";
  image_path: string;
  project: Project;
  assignedUser: User | null;
  assigned_user_id: number;
  project_id: number;
  createdBy: User;
  updatedBy: User;
  labels: Label[];
  permissions: {
    canDelete: boolean;
  };
};

export type Label = {
  id: number;
  project_id: number;
  name: string;
  variant: TaskLabelBadgeVariant;
};

export type PaginatedTask = {
  data: Task[];
  links: PaginationLinks;
  meta: PaginationMeta;
};

export type PaginatedLabel = {
  data: Label[];
  links: PaginationLinks;
  meta: PaginationMeta;
};
