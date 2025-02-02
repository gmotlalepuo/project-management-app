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
} from "@/utils/constants";
import { useTruncate } from "@/hooks/use-truncate";

type ActiveTasksTableProps = {
  activeTasks: PaginatedTask;
  queryParams: QueryParams;
  labelOptions: { value: string; label: string }[];
  projectOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  permissions: {
    canManageTasks: boolean;
  };
};

export function ActiveTasksTable({
  activeTasks,
  queryParams,
  labelOptions,
  permissions,
  projectOptions,
  statusOptions,
}: ActiveTasksTableProps) {
  queryParams = queryParams || {};

  const columns = useMemo<ColumnDef<Task, any>[]>(
    () => [
      {
        accessorKey: "id",
        defaultHidden: true,
        hideFromViewOptions: true,
      },
      {
        accessorKey: "project_id",
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
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
          <Badge
            variant={TASK_STATUS_BADGE_MAP(
              row.original.status.slug,
              row.original.status.color,
            )}
          >
            {row.original.status.name}
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
        accessorKey: "updated_at",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last Updated" />
        ),
        cell: ({ row }) => formatDate(row.original.updated_at),
        defaultHidden: true,
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
      accessorKey: "project_id",
      title: "Project",
      filterType: "select",
      options: projectOptions,
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
      accessorKey: "status", // Change back to 'status' for slug-based filtering
      title: "Status",
      filterType: "select",
      options: statusOptions,
    },
    {
      accessorKey: "due_date",
      title: "Due Date",
      filterType: "date",
    },
  ];

  return (
    <>
      <h4 className="mb-3 text-sm text-muted-foreground">
        This table displays the active tasks assigned to you.
      </h4>
      <DataTable
        columns={columns}
        entity={activeTasks}
        filterableColumns={filterableColumns}
        queryParams={queryParams}
        routeName="dashboard"
      />
    </>
  );
}
