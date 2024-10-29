import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { TrashIcon } from "lucide-react";
import { CalendarDatePicker } from "../CalendarDatePicker";
import { useState } from "react";
import { router } from "@inertiajs/react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterableColumn {
  accessorKey: string;
  title: string;
  filterType: "text" | "select" | "date";
  options?: FilterOption[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns: FilterableColumn[];
  queryParams: { [key: string]: any }; // Include queryParams to handle initial filter state
  routeName: string; // Dynamic route to pass in Inertia router
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns,
  queryParams,
  routeName, // Dynamic route
}: DataTableToolbarProps<TData>) {
  const isFiltered = Object.keys(queryParams).length > 0;

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const updateQuery = (name: string, value: string | string[]) => {
    const updatedParams = { ...queryParams, [name]: value };

    if (!value || (Array.isArray(value) && value.length === 0)) {
      delete updatedParams[name]; // Remove param if value is empty
    }

    router.get(route(routeName), updatedParams, {
      preserveState: true, // Preserve state to avoid a full page reload
      preserveScroll: true, // Maintain scroll position
    });
  };

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    updateQuery("created_at", [from.toISOString(), to.toISOString()]); // Apply date range query
  };

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Loop through filterable columns */}
        {filterableColumns.map((column) => {
          if (column.filterType === "text") {
            return (
              <Input
                key={column.accessorKey}
                placeholder={`Filter by ${column.title}`}
                defaultValue={queryParams[column.accessorKey] || ""}
                onBlur={(event) => {
                  updateQuery(
                    column.accessorKey,
                    (event.target as HTMLInputElement).value,
                  );
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    updateQuery(
                      column.accessorKey,
                      (event.target as HTMLInputElement).value,
                    );
                  }
                }}
                className="h-8 w-[150px] lg:w-[250px]"
              />
            );
          }

          if (column.filterType === "select" && column.options) {
            return (
              <DataTableFacetedFilter
                key={column.accessorKey}
                column={table.getColumn(column.accessorKey)}
                title={column.title}
                options={column.options}
                onSelect={(selectedValues: string[]) => {
                  updateQuery(column.accessorKey, selectedValues);
                }}
                initialSelectedValues={queryParams[column.accessorKey] || []}
              />
            );
          }

          if (column.filterType === "date") {
            return (
              <CalendarDatePicker
                key={column.accessorKey}
                date={dateRange}
                onDateSelect={handleDateSelect}
                className="h-9 w-[250px]"
                variant="outline"
              />
            );
          }

          return null;
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              router.get(route(routeName), {}, { replace: true });
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        ) : null}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
