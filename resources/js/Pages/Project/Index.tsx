import { ColumnDef } from "@tanstack/react-table";
import { PaginatedProject, Project } from "@/types/project";
import { DataTable } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
  PROJECT_STATUS_TEXT_MAP,
  PROJECT_STATUS_CLASS_MAP,
} from "@/utils/constants";
import { formatDate } from "@/utils/helpers";
import { FilterableColumn } from "@/types/utils";
import { Button } from "@/Components/ui/button";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Check, CirclePlus, UsersRound } from "lucide-react";

type IndexProps = {
  projects: PaginatedProject;
  queryParams: { [key: string]: any } | null;
  success: string | null;
};

// Define the table columns for the Project data
const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <Link href={route("project.show", row.original.id)}>
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <span
        className={`rounded px-2 py-1 text-white ${PROJECT_STATUS_CLASS_MAP[row.original.status]}`}
      >
        {PROJECT_STATUS_TEXT_MAP[row.original.status]}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Create Date" />
    ),
    cell: ({ row }) => formatDate(row.original.created_at),
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => formatDate(row.original.due_date),
  },
  {
    accessorKey: "createdBy.name",
    header: () => "Created By",
    cell: ({ row }) => row.original.createdBy.name,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onEdit={(row) => {
          const projectId = row.original.id;
          router.get(route("project.edit", projectId));
        }}
        onDelete={(row) => {
          const projectId = row.original.id;
          router.delete(route("project.destroy", projectId));
        }}
      />
    ),
  },
];

// Define the filterable columns and their options using constants
const filterableColumns: FilterableColumn[] = [
  {
    accessorKey: "name",
    title: "Name",
    filterType: "text",
  },
  {
    accessorKey: "status",
    title: "Status",
    filterType: "select",
    options: Object.entries(PROJECT_STATUS_TEXT_MAP).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    accessorKey: "created_at",
    title: "Create Date",
    filterType: "date",
  },
];

// Main component for the Project index page
export default function Index({ projects, queryParams, success }: IndexProps) {
  queryParams = queryParams || {};

  return (
    <AuthenticatedLayout
      header={
        <>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
              Projects
            </h2>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
              <Link href={route("project.create")}>
                <Button className="w-full sm:w-auto">
                  <CirclePlus className="h-5 w-5" />
                  <span>Create Project</span>
                </Button>
              </Link>
              <Link href={route("project.invitations")}>
                <Button variant="secondary" className="w-full sm:w-auto">
                  <UsersRound className="h-5 w-5" />
                  <span>Invitations</span>
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Take charge of your projects and actively manage your participation
            in them.
          </p>
        </>
      }
    >
      <Head title="Projects" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {success && (
            <Alert className="mb-4" variant="success">
              <Check className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-4 text-gray-900 dark:text-gray-100 sm:p-6">
              <DataTable
                columns={columns}
                entity={projects}
                filterableColumns={filterableColumns}
                queryParams={queryParams}
                routeName="project.index"
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
