// Project constants
export const PROJECT_STATUS_BADGE_MAP: Record<
  "pending" | "in_progress" | "completed",
  "warning" | "info" | "success"
> = {
  pending: "warning",
  in_progress: "info",
  completed: "success",
};

export const PROJECT_STATUS_TEXT_MAP = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

// Task constants
export const TASK_STATUS_BADGE_MAP: Record<
  "pending" | "in_progress" | "completed",
  "warning" | "info" | "success"
> = {
  pending: "warning",
  in_progress: "info",
  completed: "success",
};

export const TASK_STATUS_TEXT_MAP = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

export const TASK_PRIORITY_BADGE_MAP: Record<
  "low" | "medium" | "high",
  "low" | "medium" | "destructive"
> = {
  low: "low",
  medium: "medium",
  high: "destructive",
};

export const TASK_PRIORITY_TEXT_MAP = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

// Task Label Badge variant colors
export const TASK_LABEL_BADGE_VARIANTS = {
  red: "red",
  green: "green",
  blue: "blue",
  yellow: "yellow",
  amber: "amber",
  indigo: "indigo",
  purple: "purple",
  pink: "pink",
  teal: "teal",
  cyan: "cyan",
  gray: "gray",
} as const;

export type TaskLabelBadgeVariant = keyof typeof TASK_LABEL_BADGE_VARIANTS;

export const TASK_LABEL_BADGE_VARIANT_MAP: Record<TaskLabelBadgeVariant, string> = {
  red: "red",
  green: "green",
  blue: "blue",
  yellow: "yellow",
  amber: "amber",
  indigo: "indigo",
  purple: "purple",
  pink: "pink",
  teal: "teal",
  cyan: "cyan",
  gray: "gray",
};

// Invitation constants
export const INVITATION_STATUS_BADGE_MAP: Record<
  "pending" | "accepted" | "rejected",
  "warning" | "success" | "destructive"
> = {
  pending: "warning",
  accepted: "success",
  rejected: "destructive",
};

export const INVITATION_STATUS_TEXT_MAP = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

// Role constants
export const ROLE_TEXT_MAP = {
  admin: "Admin",
  project_manager: "Project Manager",
  project_member: "Project Member",
};
