import { PaginatedUser, User } from "./user";
import { PaginationLinks, PaginationMeta } from "./utils";

export type Project = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  due_date: string;
  status: "completed" | "pending" | "in_progress";
  image_path: string;
  createdBy: User;
  created_by: number;
  updatedBy: User;
  invitedUsers: User[];
  pivot?: {
    user_id: number;
    project_id: number;
    status: "pending" | "accepted" | "rejected";
    created_at: string;
    updated_at: string;
  };
  acceptedUsers: User[];
  tasks: Task[];
  total_tasks: number;
  completed_tasks: number;
  permissions: {
    canEdit: boolean;
    isCreator: boolean;
  };
};

export type PaginatedProject = {
  data: Project[];
  links: PaginationLinks;
  meta: PaginationMeta;
};

// Events
export type ProjectInvitationEvent = {
  project: {
    id: number;
    name: string;
  };
};
