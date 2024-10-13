export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: User;
  };
};

export type Project = {
  data: Array<{
    id: number;
    name: string;
    description: string;
    created_at: string;
    due_date: string;
    status: "completed" | "pending" | "in_progress";
    image_path: string;
    createdBy: {
      id: number;
      name: string;
      email: string;
    };
    updatedBy: {
      id: number;
      name: string;
      email: string;
    };
  }>;
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

export type Task = {
  data: Array<{
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
  }>;
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
