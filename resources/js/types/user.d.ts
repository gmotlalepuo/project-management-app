import { PermissionsEnum, RolesEnum } from "./enums";
import { PaginationLinks, PaginationMeta } from "./utils";

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at?: string;
  profile_picture?: string;
  pivot?: {
    role: string;
    status: string;
  };
  roles?: RolesEnum[];
  permissions?: PermissionsEnum[];
};

export type PaginatedUser = {
  data: User[];
  meta?: PaginationMeta;
  links?: PaginationLinks;
};
