import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import React from "react";

type Props = {
  name: string;
  sortable?: boolean;
  sort_field: string | null;
  sort_direction: string | null;
  sortChanged: (name: string) => void;
  children: React.ReactNode | null;
};

export default function TableHeading({
  name,
  sortable = true,
  sort_field = null,
  sort_direction = null,
  sortChanged,
  children,
}: Props) {
  return (
    <th onClick={(e) => sortChanged(name)}>
      <div className="flex cursor-pointer items-center justify-between gap-2 px-3 py-3">
        {children}
        {sortable && (
          <div>
            <ChevronUpIcon
              className={`w-4 ${sort_field === name && sort_direction === "asc" ? "text-white" : ""}`}
            />
            <ChevronDownIcon
              className={`-mt-1 w-4 ${sort_field === name && sort_direction === "desc" ? "text-white" : ""}`}
            />
          </div>
        )}
      </div>
    </th>
  );
}
