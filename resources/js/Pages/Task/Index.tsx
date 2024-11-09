import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { PaginatedTask, Task } from "@/types/task";
import { DataTable } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import {
  TASK_STATUS_TEXT_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_BADGE_MAP,
  TASK_PRIORITY_BADGE_MAP,
} from "@/utils/constants";
import { formatDate } from "@/utils/helpers";
import { FilterableColumn } from "@/types/utils";
import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/Components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

type IndexProps = {
  tasks: PaginatedTask;
  success: string | null;
  queryParams: { [key: string]: any };
  labelOptions: { value: string; label: string }[];
};

// Define the table columns for the Task data
const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "project.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <Link href={route("project.show", row.original.project.id)}>
        {row.original.project.name}
      </Link>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <>
        <Link href={route("task.show", row.original.id)}>
          {row.original.labels?.map((label) => (
            <Badge key={label.id} variant={label.variant} className="mr-1.5">
              {label.name}
            </Badge>
          ))}
          {row.original.name}
        </Link>
      </>
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => (
      <Badge variant={TASK_PRIORITY_BADGE_MAP[row.original.priority]}>
        {TASK_PRIORITY_TEXT_MAP[row.original.priority]}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={TASK_STATUS_BADGE_MAP[row.original.status]}>
        {TASK_STATUS_TEXT_MAP[row.original.status]}
      </Badge>
    ),
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) =>
      row.original.due_date ? formatDate(row.original.due_date) : "No date",
  },
  {
    accessorKey: "createdBy.name",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => row.original.createdBy.name,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onView={(row) => {
          const taskId = row.original.id;
          router.get(route("task.show", taskId));
        }}
        onEdit={(row) => {
          const taskId = row.original.id;
          router.get(route("task.edit", taskId));
        }}
        onDelete={(row) => {
          const taskId = row.original.id;
          router.delete(route("task.destroy", taskId));
        }}
      />
    ),
  },
];

// Main component for the Task index page
export default function Index({
  tasks,
  queryParams,
  success,
  labelOptions,
}: IndexProps) {
  queryParams = queryParams || {};

  const { toast } = useToast();

  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        variant: "success",
        description: success,
      });
    }
  }, [success]);

  const filterableColumns: FilterableColumn[] = [
    {
      accessorKey: "project_name",
      title: "Project",
      filterType: "text",
    },
    {
      accessorKey: "name",
      title: "Name",
      filterType: "text",
    },
    {
      accessorKey: "priority",
      title: "Priority",
      filterType: "select",
      options: Object.entries(TASK_PRIORITY_TEXT_MAP).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      accessorKey: "status",
      title: "Status",
      filterType: "select",
      options: Object.entries(TASK_STATUS_TEXT_MAP).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      accessorKey: "due_date",
      title: "Due Date",
      filterType: "date",
    },
    {
      accessorKey: "created_by_name",
      title: "Created By",
      filterType: "text",
    },
    {
      accessorKey: "label_ids",
      title: "Labels",
      filterType: "select",
      options: labelOptions,
    },
  ];

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Tasks
          </h2>
          <Link href={route("task.create")}>
            <Button>Create Task</Button>
          </Link>
        </div>
      }
    >
      <Head title="Tasks" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <DataTable
                columns={columns}
                entity={tasks}
                filterableColumns={filterableColumns}
                queryParams={queryParams}
                routeName="task.index"
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
