import { TASK_STATUS_BADGE_MAP, TASK_STATUS_TEXT_MAP } from "@/utils/constants";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PaginatedTask, Task } from "@/types/task";
import { Head, Link } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DataTable, ColumnDef } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { useMemo } from "react";
import { FilterableColumn } from "@/types/utils";
import { formatDate } from "@/utils/helpers";
import { ClipboardList, Timer, CheckCircle2 } from "lucide-react";

type Props = {
  totalPendingTasks: number;
  myPendingTasks: number;
  totalProgressTasks: number;
  myProgressTasks: number;
  totalCompletedTasks: number;
  myCompletedTasks: number;
  activeTasks: PaginatedTask;
  queryParams: { [key: string]: any };
};

export default function Dashboard({
  totalPendingTasks,
  myPendingTasks,
  totalProgressTasks,
  myProgressTasks,
  totalCompletedTasks,
  myCompletedTasks,
  activeTasks,
  queryParams,
}: Props) {
  queryParams = queryParams || {};

  // Define the table columns
  const columns = useMemo<ColumnDef<Task, any>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      },
      {
        accessorKey: "project.name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Project" />
        ),
        cell: ({ row }) => (
          <Link href={route("project.show", row.original.project.id)}>
            {row.original.project.name}
          </Link>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
          <Link href={route("task.show", row.original.id)}>{row.original.name}</Link>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
          <Badge variant={TASK_STATUS_BADGE_MAP[row.original.status]}>
            {TASK_STATUS_TEXT_MAP[row.original.status]}
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
    ],
    [],
  );

  const filterableColumns: FilterableColumn[] = [
    {
      accessorKey: "project_name",
      title: "Project",
      filterType: "text",
    },
    {
      accessorKey: "name",
      title: "Name",
      filterType: "text",
    },
    {
      accessorKey: "status",
      title: "Status",
      filterType: "select",
      options: Object.entries(TASK_STATUS_TEXT_MAP).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      accessorKey: "due_date",
      title: "Due Date",
      filterType: "date",
    },
  ];

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Dashboard
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-3 md:grid-cols-3 md:px-6 lg:px-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <ClipboardList className="h-6 w-6 text-amber-500" />
              <CardTitle className="!m-0 text-amber-500">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent className="text-xl">
              <span className="mr-2">{myPendingTasks}</span>/
              <span className="ml-2">{totalPendingTasks}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Timer className="h-6 w-6 text-blue-500" />
              <CardTitle className="!m-0 text-blue-500">In Progress Tasks</CardTitle>
            </CardHeader>
            <CardContent className="text-xl">
              <span className="mr-2">{myProgressTasks}</span>/
              <span className="ml-2">{totalProgressTasks}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <CardTitle className="!m-0 text-green-500">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent className="text-xl">
              <span className="mr-2">{myCompletedTasks}</span>/
              <span className="ml-2">{totalCompletedTasks}</span>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto mt-4 max-w-7xl px-3 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>My Active Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                entity={activeTasks}
                filterableColumns={filterableColumns}
                queryParams={queryParams}
                routeName="dashboard"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
