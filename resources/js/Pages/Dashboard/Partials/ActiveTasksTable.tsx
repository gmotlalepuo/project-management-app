import { Link, router } from "@inertiajs/react";
import { PaginatedTask, Task } from "@/types/task";
import { Badge } from "@/Components/ui/badge";
import { DataTable, ColumnDef } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { useMemo } from "react";
import { FilterableColumn, QueryParams } from "@/types/utils";
import { formatDate } from "@/utils/helpers";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import {
  TASK_PRIORITY_BADGE_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_BADGE_MAP,
  TASK_STATUS_TEXT_MAP,
} from "@/utils/constants";

type ActiveTasksTableProps = {
  activeTasks: PaginatedTask;
  queryParams: QueryParams;
  labelOptions: { value: string; label: string }[];
  permissions: {
    canManageTasks: boolean;
  };
};

export function ActiveTasksTable({
  activeTasks,
  queryParams,
  labelOptions,
  permissions,
}: ActiveTasksTableProps) {
  queryParams = queryParams || {};

  const columns = useMemo<ColumnDef<Task, any>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
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
        minWidth: 170,
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
        accessorKey: "label_ids",
        defaultHidden: true,
        hideFromViewOptions: true,
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
    ],
    [permissions],
  );

  const filterableColumns: FilterableColumn[] = [
    {
      accessorKey: "project.name",
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
  ];

  return (
    <DataTable
      columns={columns}
      entity={activeTasks}
      filterableColumns={filterableColumns}
      queryParams={queryParams}
      routeName="dashboard"
    />
  );
}
