import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { PaginatedTask, Task } from "@/types/task";
import { DataTable, ColumnDef } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import {
  TASK_STATUS_TEXT_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_BADGE_MAP,
  TASK_PRIORITY_BADGE_MAP,
} from "@/utils/constants";
import { formatDate } from "@/utils/helpers";
import { FilterableColumn, QueryParams } from "@/types/utils";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { CirclePlus } from "lucide-react";
import { useTruncate } from "@/hooks/use-truncate";

type IndexProps = {
  tasks: PaginatedTask;
  success: string | null;
  queryParams: QueryParams;
  labelOptions: { value: string; label: string }[];
  permissions: {
    canManageTasks: boolean;
  };
};

// Main component for the Task index page
export default function Index({
  tasks,
  queryParams,
  success,
  labelOptions,
  permissions,
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

  // Define the table columns for the Task data
  const columns = useMemo<ColumnDef<Task, any>[]>(
    () => [
      {
        accessorKey: "id",
        defaultHidden: true,
        hideFromViewOptions: true,
      },
      {
        accessorKey: "task_number",
        header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
        cell: ({ row }) => `#${row.original.task_number}`,
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
          <DataTableColumnHeader column={column} title="Task Name" />
        ),
        cell: ({ row }) => (
          <Link
            className="group flex flex-col items-start gap-1.5 md:flex-row md:items-center md:justify-between"
            href={route("task.show", row.original.id)}
          >
            <span>{row.original.name}</span>
            <div className="flex items-center gap-2">
              {row.original.labels?.slice(0, 2).map((label) => {
                const truncatedName = useTruncate(label.name);
                return (
                  <Badge key={label.id} variant={label.variant}>
                    {truncatedName}
                  </Badge>
                );
              })}
            </div>
          </Link>
        ),
        minWidth: 200,
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
        defaultHidden: true,
      },
      {
        accessorKey: "assignedUser.name",
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Assigned To" />
        ),
        cell: ({ row }) => row.original.assignedUser?.name ?? "Unassigned",
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
            onAssign={(row) => {
              router.post(route("task.assignToMe", row.original.id));
            }}
            onUnassign={(row) => {
              router.post(route("task.unassign", row.original.id));
            }}
            canEdit={permissions.canManageTasks}
          />
        ),
      },
      {
        accessorKey: "label_ids",
        defaultHidden: true,
        hideFromViewOptions: true,
      },
    ],
    [permissions],
  );

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
      accessorKey: "label_ids",
      title: "Labels",
      filterType: "select",
      options: labelOptions,
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
  ];

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Tasks
          </h2>
        </div>
      }
    >
      <Head title="Tasks" />
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Tasks Effectively</CardTitle>
            </CardHeader>
            <CardContent>
              <h4>
                Organize your tasks, set priorities, and track progress. Use the
                tools provided to create, view, and update your tasks efficiently.
              </h4>
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                <Link href={route("task.create")}>
                  <Button className="w-full shadow sm:w-auto">
                    <CirclePlus className="h-5 w-5" />
                    <span>Create Task</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <div className="mt-8 rounded-lg border bg-card text-card-foreground shadow-sm">
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
