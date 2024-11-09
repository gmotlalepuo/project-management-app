import { TaskLabelBadgeVariant } from "@/utils/constants";

export type Task = {
  id: number;
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
};

export type Label = {
  id: number;
  project_id: number;
  name: string;
  variant: TaskLabelBadgeVariant;
};

export type PaginatedTask = {
  data: Task[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
};
