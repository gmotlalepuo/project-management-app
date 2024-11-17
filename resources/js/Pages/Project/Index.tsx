import { PaginatedProject, Project } from "@/types/project";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { formatDate } from "@/utils/helpers";
import { CirclePlus, UsersRound } from "lucide-react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import {
  PROJECT_STATUS_BADGE_MAP,
  PROJECT_STATUS_TEXT_MAP,
} from "@/utils/constants";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import { FilterableColumn } from "@/types/utils";
import { DataTable } from "@/Components/data-table-components/data-table";
import { Label } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

type IndexProps = {
  projects: PaginatedProject;
  queryParams: { [key: string]: any } | null;
  success: string | null;
};

// Define the table columns for the Project data
const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <Link href={route("project.show", row.original.id)}>
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={PROJECT_STATUS_BADGE_MAP[row.original.status]}>
        {PROJECT_STATUS_TEXT_MAP[row.original.status]}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Create Date" />
    ),
    cell: ({ row }) => formatDate(row.original.created_at),
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
    accessorKey: "createdBy.name",
    header: () => "Created By",
    cell: ({ row }) => row.original.createdBy.name,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onView={(row) => {
          const projectId = row.original.id;
          router.get(route("project.show", projectId));
        }}
        onEdit={(row) => {
          const projectId = row.original.id;
          router.get(route("project.edit", projectId));
        }}
        onDelete={(row) => {
          const projectId = row.original.id;
          router.delete(route("project.destroy", projectId));
        }}
      />
    ),
  },
];

// Define the filterable columns and their options using constants
const filterableColumns: FilterableColumn[] = [
  {
    accessorKey: "name",
    title: "Name",
    filterType: "text",
  },
  {
    accessorKey: "status",
    title: "Status",
    filterType: "select",
    options: Object.entries(PROJECT_STATUS_TEXT_MAP).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    accessorKey: "created_at",
    title: "Create Date",
    filterType: "date",
  },
];

// Main component for the Project index page
export default function Index({ projects, queryParams, success }: IndexProps) {
  const { toast } = useToast();
  queryParams = queryParams || {};

  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        variant: "success",
        description: success,
      });
    }
  }, [success]);

  const calculateProgress = (tasks: any[]) => {
    const completedTasks = tasks.filter(
      (task) => task.status === "completed",
    ).length;
    return tasks.length ? (completedTasks / tasks.length) * 100 : 0;
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Projects
          </h2>
        </div>
      }
    >
      <Head title="Projects" />

      <main className="space-y-8 py-12">
        <section className="mx-auto max-w-7xl gap-6 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Projects Efficiently</CardTitle>
            </CardHeader>
            <CardContent>
              <h4>
                Track progress, manage tasks, and collaborate with your team.
                Use the tools provided to create, view, and update your projects
                seamlessly.
              </h4>
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                <Link href={route("project.create")}>
                  <Button className="w-full sm:w-auto">
                    <CirclePlus className="h-5 w-5" />
                    <span>Create Project</span>
                  </Button>
                </Link>
                <Link href={route("project.invitations")}>
                  <Button variant="secondary" className="w-full sm:w-auto">
                    <UsersRound className="h-5 w-5" />
                    <span>Invitations</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mx-auto flex max-w-7xl gap-6 sm:px-6 lg:px-8">
          {/* Project Cards Container */}
          <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2">
            {projects.data.slice(0, 6).map((project) => (
              <div
                key={project.id}
                className="rounded-lg bg-background p-5 shadow"
              >
                {/* Project Header */}
                <div className="flex items-center justify-between space-x-1">
                  <Link
                    href={route("project.show", project.id)}
                    className="text-lg font-semibold"
                  >
                    {project.name}
                  </Link>
                  <span className="self-baseline">
                    <DataTableRowActions
                      row={{ original: project } as Row<Project>}
                      onView={() => {
                        router.get(route("project.show", project.id));
                      }}
                      onEdit={() => {
                        router.get(route("project.edit", project.id));
                      }}
                      onDelete={() => {
                        router.delete(route("project.destroy", project.id));
                      }}
                    />
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Created on {formatDate(project.created_at)}
                </p>

                {/* Task Previews */}
                <ul className="mt-3 space-y-1 text-sm text-gray-800 dark:text-gray-200">
                  {project.tasks.slice(0, 5).map((task) => (
                    <li key={task.id} className="truncate">
                      {task.labels?.map((label: Label) => (
                        <Badge
                          key={label.id}
                          variant={label.variant}
                          className="mr-1"
                        >
                          {label.name}
                        </Badge>
                      ))}
                      <Link
                        href={route("task.show", task.id)}
                        className={
                          task.status === "completed" ? "line-through" : ""
                        }
                      >
                        {task.name}
                      </Link>
                    </li>
                  ))}
                  {project.tasks.length > 5 && (
                    <li className="text-gray-500">+ more tasks...</li>
                  )}
                </ul>

                {/* Progress Bar */}
                <div className="mt-3">
                  <Progress
                    value={calculateProgress(project.tasks)}
                    className="h-2"
                  />
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {calculateProgress(project.tasks).toFixed(0)}% Complete
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="w-1/4 space-y-4">
            <div className="rounded-lg bg-background p-4 shadow">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Projects Completed
              </h3>
              <div className="mt-4 flex items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-orange-500">
                  <span className="text-xl font-bold text-orange-500">
                    {(
                      (projects.data.filter(
                        (project) => project.status === "completed",
                      ).length /
                        projects.data.length) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold">
                    {
                      projects.data.filter(
                        (project) => project.status === "completed",
                      ).length
                    }{" "}
                    Completed
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {projects.data.length} Total Projects
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-background p-4 shadow">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Recently Completed
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {projects.data
                  .filter((project) => project.status === "completed")
                  .slice(0, 3)
                  .map((project) => (
                    <li key={project.id} className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {project.name.charAt(0)}
                      </Badge>
                      <Link
                        href={route("project.show", project.id)}
                        className="hover:underline"
                      >
                        {project.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-7xl gap-6 sm:px-6 lg:px-8">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-4 text-gray-900 dark:text-gray-100 sm:p-6">
              <h3 className="mb-3 text-lg font-semibold leading-tight">
                All Projects
              </h3>
              <DataTable
                columns={columns}
                entity={projects}
                filterableColumns={filterableColumns}
                queryParams={queryParams}
                routeName="project.index"
              />
            </div>
          </div>
        </section>
      </main>
    </AuthenticatedLayout>
  );
}
