import * as React from "react";
import {
  ColumnDef as BaseColumnDef,
  ColumnFiltersState,
  OnChangeFn,
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
  QueryParams,
} from "@/types/utils";
import { router } from "@inertiajs/react";
import { Loader2 } from "lucide-react";

// Extend ColumnDef to include defaultHidden and minWidth
export type ColumnDef<TData, TValue> = BaseColumnDef<TData, TValue> & {
  defaultHidden?: boolean;
  hideFromViewOptions?: boolean;
  accessorKey?: string;
  minWidth?: number;
};

// Update the DataTableProps interface
type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  entity: {
    data: TData[];
    meta: PaginationMeta;
    links: PaginationLinks;
  };
  filterableColumns: FilterableColumn[];
  queryParams: QueryParams;
  routeName: string;
  entityId?: string | number;
  children?: React.ReactNode;
};

export function DataTable<TData, TValue>({
  columns,
  entity,
  filterableColumns,
  queryParams = {},
  routeName,
  entityId,
}: DataTableProps<TData, TValue>) {
  const { data, meta } = entity;
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    columns.reduce((acc, column) => {
      if (column.defaultHidden) {
        acc[column.id || (column.accessorKey as string)] = false;
      }
      return acc;
    }, {} as VisibilityState),
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: queryParams.sortField || "updated_at",
      desc: queryParams.sortDirection !== "asc",
    },
  ]);
  const [pageSize, setPageSize] = React.useState(queryParams.per_page || 10); // Use pageSize state
  const [isLoading, setIsLoading] = React.useState(false); // Add loading state

  // This is a workaround to handle the initial page load
  queryParams.page = queryParams.page || 1;

  // Initialize sorting state from URL params
  React.useEffect(() => {
    if (queryParams.sort_field) {
      setSorting([
        {
          id: queryParams.sort_field,
          desc: queryParams.sort_direction === "desc",
        },
      ]);
    }
  }, [queryParams.sort_field, queryParams.sort_direction]);

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const updatedSorting =
      typeof updaterOrValue === "function"
        ? updaterOrValue(sorting)
        : updaterOrValue;

    setSorting(updatedSorting);

    if (updatedSorting.length > 0) {
      const { id, desc } = updatedSorting[0];
      const updatedParams = {
        ...queryParams,
        sortField: id,
        sortDirection: desc ? "desc" : "asc",
        page: 1, // Reset to first page when sorting changes
      };

      setIsLoading(true);
      router.get(route(routeName, { id: entityId }), updatedParams, {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setIsLoading(false),
        onError: () => setIsLoading(false),
      });
    }
  };

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
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualSorting: true, // Add this line to enable server-side sorting
    manualPagination: true, // Important
    pageCount: meta.last_page, // Use last_page from meta data
  });

  // Fix event handlers for loading state
  React.useEffect(() => {
    const startHandler = (event: any) => {
      const url = new URL(event.detail.visit.url, window.location.origin);
      const hasTableParams =
        url.searchParams.has("page") ||
        url.searchParams.has("per_page") ||
        url.searchParams.has("sort_field") ||
        url.searchParams.has("sort_direction");

      if (hasTableParams) {
        setIsLoading(true);
      }
    };

    const finishHandler = () => {
      setIsLoading(false);
    };

    document.addEventListener("inertia:start", startHandler);
    document.addEventListener("inertia:finish", finishHandler);
    document.addEventListener("inertia:error", finishHandler);

    return () => {
      document.removeEventListener("inertia:start", startHandler);
      document.removeEventListener("inertia:finish", finishHandler);
      document.removeEventListener("inertia:error", finishHandler);
    };
  }, []);

  const handleTableOperation = (params: QueryParams) => {
    setIsLoading(true);

    // If this is a reset operation (params only contains tab and/or page)
    const isReset = Object.keys(params).every((key) =>
      ["tab", "page"].includes(key),
    );

    if (isReset) {
      // For reset, only keep specified params and remove everything else
      router.get(route(routeName, { id: entityId }), params, {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setIsLoading(false),
        onError: () => setIsLoading(false),
      });
      return;
    }

    // For non-reset operations, handle normally
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          acc[key] = value;
        }
      } else if (value !== null && value !== undefined && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {} as QueryParams);

    router.get(route(routeName, { id: entityId }), cleanParams, {
      preserveState: true,
      preserveScroll: true,
      onFinish: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    });
  };

  // Move filter handler here from toolbar
  const handleFilter = (name: string, value: string | string[]) => {
    const updatedParams: QueryParams = {
      ...queryParams,
      page: 1, // Reset to first page when filtering
      [name]: value,
    };

    // Remove empty filters
    if (!value || (Array.isArray(value) && value.length === 0)) {
      delete updatedParams[name];
    }

    handleTableOperation(updatedParams);
  };

  // Handle reset with debugging
  const handleReset = () => {
    // Only preserve tab if it exists, and always reset to page 1
    const preservedParams = {
      ...(queryParams.tab ? { tab: queryParams.tab } : {}),
      page: 1,
    };
    handleTableOperation(preservedParams);
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filterableColumns={filterableColumns}
        queryParams={queryParams}
        routeName={routeName}
        entityId={entityId}
        isLoading={isLoading}
        onFilter={handleFilter}
        onReset={handleReset}
      />
      <div className="relative overflow-y-auto rounded-md border">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="cursor-pointer px-4 py-2 dark:text-gray-300"
                    key={header.id}
                    colSpan={header.colSpan}
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
        isLoading={isLoading}
      />
    </div>
  );
}
