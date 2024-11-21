import * as React from "react";
import {
  ColumnDef as BaseColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import {
  FilterableColumn,
  PaginationLinks,
  PaginationMeta,
} from "@/types/utils";
import { router } from "@inertiajs/react";

// Extend ColumnDef to include defaultHidden and minWidth
export type ColumnDef<TData, TValue> = BaseColumnDef<TData, TValue> & {
  defaultHidden?: boolean;
  accessorKey?: string;
  minWidth?: number;
};

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  entity: {
    data: TData[];
    meta: PaginationMeta;
    links: PaginationLinks;
  };
  filterableColumns: FilterableColumn[];
  queryParams: { [key: string]: any };
  routeName: string;
  entityId?: string | number;
  children?: React.ReactNode;
};

export function DataTable<TData, TValue>({
  columns,
  entity,
  filterableColumns,
  queryParams,
  routeName,
  entityId,
}: DataTableProps<TData, TValue>) {
  const { data, meta } = entity;
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(
      columns.reduce((acc, column) => {
        if (column.defaultHidden) {
          acc[column.id || (column.accessorKey as string)] = false;
        }
        return acc;
      }, {} as VisibilityState),
    );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageSize, setPageSize] = React.useState(queryParams.per_page || 10); // Use pageSize state

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: meta.current_page - 1, // React Table uses 0-based index
        pageSize, // Pass pageSize from state
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true, // Important
    pageCount: meta.last_page, // Use last_page from meta data
  });

  // Sort change function
  // Updated sortChanged function in DataTable
  const sortChanged = (columnId: string) => {
    const column = table.getColumn(columnId);

    // Skip sorting if the column does not allow sorting
    if (!column || !column.getCanSort()) return;

    if (columnId === queryParams.sort_field) {
      queryParams.sort_direction =
        queryParams.sort_direction === "asc" ? "desc" : "asc";
    } else {
      queryParams.sort_field = columnId;
      queryParams.sort_direction = "asc";
    }

    if (entityId) {
      queryParams.entityId = entityId; // Include entityId if provided
    }

    router.get(route(routeName, { id: entityId }), queryParams, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filterableColumns={filterableColumns}
        queryParams={queryParams}
        routeName={routeName}
        entityId={entityId}
      />
      <div className="overflow-y-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="cursor-pointer px-4 py-2 dark:text-gray-300"
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={() => sortChanged(header.column.id)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-4 py-2" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        paginationData={entity}
        queryParams={queryParams}
        routeName={routeName}
        entityId={entityId}
      />
    </div>
  );
}
