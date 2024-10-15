export type Task = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  due_date: string;
  status: "completed" | "pending" | "in_progress";
  priority: string;
  image_path: string;
  project: Project;
  assignedUser: User | null;
  createdBy: User;
  updatedBy: User;
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
