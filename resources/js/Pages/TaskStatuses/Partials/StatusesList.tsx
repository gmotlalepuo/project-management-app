import { DataTable } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { Badge } from "@/Components/ui/badge";
import { ColumnDef } from "@/Components/data-table-components/data-table";
import { FilterableColumn } from "@/types/utils";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import { router } from "@inertiajs/react";
import { TASK_STATUS_BADGE_VARIANTS } from "@/utils/constants";
import { TaskStatus, PaginatedTaskStatus } from "@/types/task";

type Props = {
  statuses: PaginatedTaskStatus;
  projectId: number;
  queryParams: any;
};

export default function StatusesList({ statuses, projectId, queryParams }: Props) {
  const columns: ColumnDef<TaskStatus, any>[] = [
    {
      accessorKey: "id",
      defaultHidden: true,
      hideFromViewOptions: true,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <Badge variant={row.original.color}>{row.original.name}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "color",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Style" />
      ),
      cell: ({ row }) => <div className="capitalize">{row.original.color}</div>,
    },
    {
      accessorKey: "created_by",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created By" />
      ),
      cell: ({ row }) => {
        if (row.original.is_default) {
          return "Default Status";
        }
        return row.original.created_by?.name || "Default Status";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        // Don't show actions for default statuses
        if (row.original.is_default) {
          return null;
        }

        return (
          <DataTableRowActions
            row={row}
            onEdit={(row) => {
              router.get(
                route("project.statuses.edit", {
                  project: projectId,
                  status: row.original.id,
                }),
              );
            }}
            onDelete={(row) => {
              router.delete(
                route("project.statuses.destroy", {
                  project: projectId,
                  status: row.original.id,
                }),
                {
                  preserveScroll: true,
                },
              );
            }}
            canEdit={true}
          />
        );
      },
    },
  ];

  const filterableColumns: FilterableColumn[] = [
    {
      accessorKey: "name",
      title: "Status Name",
      filterType: "text",
    },
    {
      accessorKey: "color",
      title: "Style",
      filterType: "select",
      options: Object.entries(TASK_STATUS_BADGE_VARIANTS).map(([key]) => ({
        value: key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
      })),
    },
  ];

  return (
    <div className="rounded-lg bg-card p-4 shadow-sm sm:p-6">
      <DataTable
        columns={columns}
        entity={statuses}
        filterableColumns={filterableColumns}
        queryParams={queryParams}
        routeName="project.statuses.index"
        entityId={projectId}
      />
    </div>
  );
}
