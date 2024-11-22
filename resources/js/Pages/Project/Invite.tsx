import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { DataTable } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import {
  INVITATION_STATUS_BADGE_MAP,
  INVITATION_STATUS_TEXT_MAP,
} from "@/utils/constants";
import { useToast } from "@/hooks/use-toast";
import { PaginatedProject, Project } from "@/types/project";
import { FilterableColumn } from "@/types/utils";
import { useEffect } from "react";

type PageProps = {
  invitations: PaginatedProject;
  success: string | null;
  queryParams: { [key: string]: any } | null;
};

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Name" />
    ),
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorFn: (row) => row.pivot?.status,
    id: "pivot.status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.pivot?.status;
      return (
        <Badge
          variant={
            INVITATION_STATUS_BADGE_MAP[
              status as keyof typeof INVITATION_STATUS_BADGE_MAP
            ]
          }
        >
          {
            INVITATION_STATUS_TEXT_MAP[
              status as keyof typeof INVITATION_STATUS_TEXT_MAP
            ]
          }
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) =>
      row.original.pivot?.status === "pending" && (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleAccept(row.original.id)}>
            Accept
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleReject(row.original.id)}
          >
            Reject
          </Button>
        </div>
      ),
  },
];

const filterableColumns: FilterableColumn[] = [
  {
    accessorKey: "name",
    title: "Project Name",
    filterType: "text",
  },
  {
    accessorKey: "pivot.status",
    title: "Status",
    filterType: "select",
    options: Object.entries(INVITATION_STATUS_TEXT_MAP).map(
      ([value, label]) => ({
        value,
        label,
      }),
    ),
  },
];

const handleAccept = (projectId: number) => {
  router.post(route("project.acceptInvitation", projectId), {
    preserveScroll: true,
  });
};

const handleReject = (projectId: number) => {
  router.post(route("project.rejectInvitation", projectId), {
    preserveScroll: true,
  });
};

export default function Invite({
  invitations,
  success,
  queryParams,
}: PageProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        description: success,
        variant: "success",
      });
    }
  }, [success]);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Project Invitations
        </h2>
      }
    >
      <Head title="Invitations" />
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-4 text-gray-900 dark:text-gray-100 sm:p-6">
              <DataTable
                columns={columns}
                entity={invitations}
                filterableColumns={filterableColumns}
                queryParams={queryParams || {}}
                routeName="project.invitations"
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
