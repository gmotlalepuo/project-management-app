import { Label, PaginatedLabel } from "@/types/task";
import { DataTable } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { Badge } from "@/Components/ui/badge";
import { ColumnDef } from "@/Components/data-table-components/data-table";
import { FilterableColumn } from "@/types/utils";
import { Button } from "@/Components/ui/button";
import { CirclePlus } from "lucide-react";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import { Link, router } from "@inertiajs/react";
import { TASK_LABEL_BADGE_VARIANTS } from "@/utils/constants";

type Props = {
  labels: PaginatedLabel;
  projectId: number;
  queryParams: any;
};

export default function LabelList({ labels, projectId, queryParams }: Props) {
  const columns: ColumnDef<Label, any>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Label Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <Badge variant={row.original.variant}>{row.original.name}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "variant",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Style" />
      ),
      cell: ({ row }) => <div className="capitalize">{row.original.variant}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onEdit={(row) => {
            router.get(
              route("project.labels.edit", {
                project: projectId,
                label: row.original.id,
              }),
            );
          }}
          onDelete={(row) => {
            router.delete(
              route("project.labels.destroy", {
                project: projectId,
                label: row.original.id,
              }),
              {
                preserveScroll: true,
              },
            );
          }}
          canEdit={true}
        />
      ),
    },
  ];

  const filterableColumns: FilterableColumn[] = [
    {
      accessorKey: "name",
      title: "Label Name",
      filterType: "text",
    },
    {
      accessorKey: "variant",
      title: "Style",
      filterType: "select",
      options: Object.entries(TASK_LABEL_BADGE_VARIANTS).map(([key]) => ({
        value: key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
      })),
    },
  ];

  return (
    <div className="rounded-lg bg-card p-4 shadow-sm sm:p-6">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Project Labels
        </h2>
        <Link
          href={route("project.labels.create", projectId)}
          className="inline-flex items-center gap-2"
        >
          <Button>
            <CirclePlus className="h-5 w-5" />
            <span>Create Label</span>
          </Button>
        </Link>
      </header>

      <DataTable
        columns={columns}
        entity={labels}
        filterableColumns={filterableColumns}
        queryParams={queryParams}
        routeName="project.labels.index"
        entityId={projectId}
      />
    </div>
  );
}
