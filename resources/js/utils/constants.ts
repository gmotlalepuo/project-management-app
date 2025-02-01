import { type BadgeVariant } from "@/Components/ui/badge";
import { Clock, PlayCircle, CheckCircle2, LucideIcon, Info } from "lucide-react";

// Project constants
export type StatusType = "pending" | "in_progress" | "completed" | string;

export type TaskStatus = {
  id: number;
  name: string;
  slug: StatusType;
  color: string;
  is_default: boolean;
};

type StatusConfig = {
  icon: LucideIcon;
  color: string;
  text: string;
  badge: BadgeVariant;
};

export const STATUS_CONFIG: Record<StatusType, StatusConfig> & {
  default: StatusConfig;
} = {
  pending: {
    icon: Clock,
    color: "text-yellow-500",
    text: "Pending",
    badge: "warning",
  },
  in_progress: {
    icon: PlayCircle,
    color: "text-blue-500",
    text: "In Progress",
    badge: "info",
  },
  completed: {
    icon: CheckCircle2,
    color: "text-green-500",
    text: "Completed",
    badge: "success",
  },
  default: {
    icon: Info,
    color: "text-purple-500",
    text: "Custom Status",
    badge: "secondary",
  },
} as const;

// Helper function to get status config
export const getStatusConfig = (status: StatusType): StatusConfig => {
  return STATUS_CONFIG[status] || STATUS_CONFIG.default;
};

// Helper function to get status text options
export const getStatusOptions = () => {
  return ["pending", "in_progress", "completed"].map((status) => ({
    value: status,
    label: getStatusConfig(status).text,
  }));
};

// Update task status badge map to handle custom statuses
export const TASK_STATUS_BADGE_MAP = (status: StatusType): BadgeVariant => {
  return getStatusConfig(status).badge;
};

export const PROJECT_STATUS_BADGE_MAP = (status: StatusType): BadgeVariant => {
  return getStatusConfig(status).badge;
};

export const PROJECT_STATUS_TEXT_MAP = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

// Task constants
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
