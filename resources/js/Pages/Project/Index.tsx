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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Projects
          </h2>
          <Link
            href={route("project.create")}
            className="rounded bg-emerald-500 px-3 py-1 text-white shadow transition-all hover:bg-emerald-600"
          >
            Create Project
          </Link>
        </div>
      }
    >
      <Head title="Projects" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {success && (
            <div className="mb-4 rounded bg-emerald-500 px-4 py-2 text-white">
              {success}
            </div>
          )}

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 text-gray-900 dark:text-gray-100">
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
