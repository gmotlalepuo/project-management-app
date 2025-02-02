import { DataTable, ColumnDef } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { Badge } from "@/Components/ui/badge";
import { formatDate } from "@/utils/helpers";
import {
  TASK_PRIORITY_BADGE_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_BADGE_MAP,
} from "@/utils/constants";
import { PaginatedTask, Task } from "@/types/task";
import { FilterableColumn, QueryParams } from "@/types/utils";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { CirclePlus, Tag } from "lucide-react";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import { useTruncate } from "@/hooks/use-truncate";

type Props = {
  tasks: PaginatedTask;
  queryParams: QueryParams;
  projectId: number;
  labelOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  permissions: {
    canManageTasks: boolean;
  };
};

export default function ProjectTasks({
  tasks,
  queryParams,
  projectId,
  permissions,
  labelOptions,
  statusOptions,
}: Props) {
  queryParams = queryParams || {};

  const columns: ColumnDef<Task, any>[] = [
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Task Name" />
      ),
      cell: ({ row }) => {
        return (
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
        );
      },
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
      accessorKey: "assignedUser.name",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Assigned To" />
      ),
      cell: ({ row }) => row.original.assignedUser?.name ?? "Unassigned",
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
  ];

  const filterableColumns: FilterableColumn[] = [
    { accessorKey: "name", title: "Task Name", filterType: "text" },
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
      options: statusOptions,
    },
    {
      accessorKey: "due_date",
      title: "Due Date",
      filterType: "date",
    },
  ];

  return (
    <div className="rounded-lg bg-card p-4 shadow-sm sm:p-6">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          All Project Tasks
        </h2>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Link
            href={route("task.create", { project_id: projectId })}
            className="inline-flex items-center gap-2"
          >
            <Button className="w-full sm:w-auto">
              <CirclePlus className="h-5 w-5" />
              <span>Create Task</span>
            </Button>
          </Link>
          {permissions.canManageTasks && (
            <Link href={route("project.labels.index", projectId)}>
              <Button variant="secondary" className="w-full sm:w-auto">
                <Tag className="h-5 w-5" />
                <span>Manage Task Labels</span>
              </Button>
            </Link>
          )}
        </div>
      </header>

      <DataTable
        columns={columns}
        entity={tasks}
        filterableColumns={filterableColumns}
        queryParams={queryParams}
        routeName="project.show"
        entityId={projectId}
      />
    </div>
  );
}
