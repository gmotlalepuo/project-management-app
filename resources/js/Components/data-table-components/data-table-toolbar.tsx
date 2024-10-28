import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { TrashIcon } from "lucide-react";
import { CalendarDatePicker } from "../CalendarDatePicker";
import { useState } from "react";

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
  filterableColumns: FilterableColumn[]; // Pass filterable columns as props
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    // Apply date range filter for a date column if applicable
    table.getColumn("date")?.setFilterValue([from, to]);
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
                value={
                  (table
                    .getColumn(column.accessorKey)
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) => {
                  table
                    .getColumn(column.accessorKey)
                    ?.setFilterValue(event.target.value);
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
            onClick={() => table.resetColumnFilters()}
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
