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
};

export type PaginatedUser = {
  data: User[];
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
