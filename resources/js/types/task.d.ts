import { TaskLabelBadgeVariant, TaskStatusBadgeVariant } from "@/utils/constants";
import { PaginationLinks, PaginationMeta } from "./utils";

export type Task = {
  id: number;
  task_number: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  due_date: string;
  status: {
    id: number;
    name: string;
    slug: string;
    color: string;
    is_default: boolean;
  };
  status_id: number;
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
  comments: TaskComment[];
  can: {
    edit: boolean;
    delete: boolean;
    assign: boolean;
    unassign: boolean;
    comment: boolean;
  };
};

export type TaskComment = {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  user: User;
  replies?: TaskComment[];
  parent_id?: number | null;
  can: {
    edit: boolean;
    delete: boolean;
    reply: boolean;
  };
};

export type Label = {
  id: number;
  project_id: number;
  name: string;
  variant: TaskLabelBadgeVariant;
  is_default: boolean;
  created_by: User | null;
  updated_by: User | null;
};

export type TaskStatus = {
  id: number;
  name: string;
  color: TaskStatusBadgeVariant;
  is_default: boolean;
  created_by: {
    name: string;
  } | null;
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

export type PaginatedTaskStatus = {
  data: TaskStatus[];
  links: PaginationLinks;
  meta: PaginationMeta;
};
