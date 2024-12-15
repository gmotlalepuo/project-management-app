import {
  TASK_PRIORITY_BADGE_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_BADGE_MAP,
  TASK_STATUS_TEXT_MAP,
} from "@/utils/constants";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PaginatedTask, Task } from "@/types/task";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DataTable, ColumnDef } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { useEffect, useMemo } from "react";
import { FilterableColumn, QueryParams } from "@/types/utils";
import { formatDate } from "@/utils/helpers";
import {
  ClipboardList,
  Timer,
  CheckCircle2,
  CirclePlus,
  UsersRound,
  Layout,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import { useToast } from "@/hooks/use-toast";

type Props = {
  totalPendingTasks: number;
  myPendingTasks: number;
  totalProgressTasks: number;
  myProgressTasks: number;
  totalCompletedTasks: number;
  myCompletedTasks: number;
  activeTasks: PaginatedTask;
  success: string | null;
  queryParams: QueryParams;
  labelOptions: { value: string; label: string }[];
  permissions: {
    canManageTasks: boolean;
  };
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
  labelOptions,
  permissions,
  success,
}: Props) {
  const { allTasks } = usePage().props as unknown as { allTasks: Task[] };
  queryParams = queryParams || {};

  const { toast } = useToast();

  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        variant: "success",
        description: success,
      });
    }
  }, [success]);

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
        enableSorting: false,
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
          <>
            <Link href={route("task.show", row.original.id)}>
              {row.original.labels?.map((label) => (
                <Badge key={label.id} variant={label.variant} className="mr-1.5">
                  {label.name}
                </Badge>
              ))}
              {row.original.name}
            </Link>
          </>
        ),
        minWidth: 170,
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
      {
        accessorKey: "label_ids",
        defaultHidden: true,
        hideFromViewOptions: true,
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
    ],
    [permissions],
  );

  const filterableColumns: FilterableColumn[] = [
    {
      accessorKey: "project.name", // Change from project_name to project.name
      title: "Project",
      filterType: "text",
    },
    {
      accessorKey: "name",
      title: "Name",
      filterType: "text",
    },
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

  const hasTasks =
    totalPendingTasks > 0 || totalProgressTasks > 0 || totalCompletedTasks > 0;

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
        <div className="mx-auto max-w-7xl space-y-6 px-3 sm:px-6 lg:px-8">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Teamsync</CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="mb-4">
                Manage your projects and tasks efficiently. Start by creating a new
                project or task, or check your pending invitations.
              </h4>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Link href={route("project.create")}>
                  <Button className="w-full sm:w-auto">
                    <CirclePlus className="mr-2 h-5 w-5" />
                    <span>Create Project</span>
                  </Button>
                </Link>
                <Link href={route("task.create")}>
                  <Button className="w-full sm:w-auto">
                    <CheckSquare className="mr-2 h-5 w-5" />
                    <span>Create Task</span>
                  </Button>
                </Link>
                <Link href={route("project.invitations")}>
                  <Button variant="secondary" className="w-full sm:w-auto">
                    <UsersRound className="mr-2 h-5 w-5" />
                    <span>Invitations</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link href={route("project.index")} className="block">
              <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center gap-3">
                  <Layout className="h-8 w-8 text-primary" />
                  <CardTitle className="!m-0">Projects Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    View and manage all your projects
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href={route("task.index")} className="block">
              <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center gap-3">
                  <CheckSquare className="h-8 w-8 text-primary" />
                  <CardTitle className="!m-0">Tasks Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    View and manage all your tasks
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Stats Cards */}
          {hasTasks && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center gap-3">
                    <ClipboardList className="h-6 w-6 text-amber-500" />
                    <CardTitle className="!m-0 text-amber-500">
                      Pending Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl">
                      <span className="mr-2">{myPendingTasks}</span>/
                      <span className="ml-2">{totalPendingTasks}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tasks assigned to you / Total tasks in your projects
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Timer className="h-6 w-6 text-blue-500" />
                    <CardTitle className="!m-0 text-blue-500">
                      In Progress Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl">
                      <span className="mr-2">{myProgressTasks}</span>/
                      <span className="ml-2">{totalProgressTasks}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tasks assigned to you / Total tasks in your projects
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    <CardTitle className="!m-0 text-green-500">
                      Completed Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl">
                      <span className="mr-2">{myCompletedTasks}</span>/
                      <span className="ml-2">{totalCompletedTasks}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tasks assigned to you / Total tasks in your projects
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Tasks Table */}
              {allTasks.length > 0 && (
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
              )}
            </>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
