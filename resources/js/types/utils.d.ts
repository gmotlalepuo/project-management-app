export type FilterOption = {
  label: string;
  value: string;
};

export type FilterableColumn = {
  accessorKey: string;
  title: string;
  filterType: "text" | "select" | "date";
  options?: FilterOption[];
};
