import { PaginatedProject, Project } from "@/types/project";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/helpers";
import { CirclePlus, UsersRound, FolderPlus } from "lucide-react";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import {
  PROJECT_STATUS_BADGE_MAP,
  PROJECT_STATUS_TEXT_MAP,
} from "@/utils/constants";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import { FilterableColumn } from "@/types/utils";
import { DataTable, ColumnDef } from "@/Components/data-table-components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { PageProps } from "@/types";
import ProjectCards from "./Partials/ProjectCards";
import ProjectStats from "./Partials/ProjectStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

type IndexProps = {
  projects: PaginatedProject & {
    permissions: {
      [key: number]: boolean; // project id -> canEditProject mapping
    };
  };
  allProjects: Project[];
  queryParams: { [key: string]: any } | null;
  success: string | null;
  activeTab: string;
};

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
  const {
    allProjects,
    auth: { user },
    activeTab: initialActiveTab = "overview",
  } = usePage<PageProps & IndexProps>().props;
  queryParams = queryParams || {};

  const [activeTab, setActiveTab] = useState(initialActiveTab);

  // Update the URL without making a server request
  const updateUrlWithoutRefresh = (newTab: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", newTab);
    window.history.pushState({ tab: newTab }, "", url.toString());
  };

  // Replace the existing handleTabChange
  const handleTabChange = (newTab: string) => {
    if (newTab !== activeTab) {
      setActiveTab(newTab);
      updateUrlWithoutRefresh(newTab);
    }
  };

  // Update useEffect for popstate event
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const url = new URL(window.location.href);
      const tab = url.searchParams.get("tab") || "overview";
      setActiveTab(tab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Define the table columns for the Project data
  const columns: ColumnDef<Project, any>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
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
      accessorKey: "updated_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Updated" />
      ),
      cell: ({ row }) => formatDate(row.original.updated_at),
      defaultHidden: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onView={() => router.get(route("project.show", row.original.id))}
          onEdit={() => router.get(route("project.edit", row.original.id))}
          onDelete={() => router.delete(route("project.destroy", row.original.id))}
          onLeave={() => {
            router.post(route("project.leave", { project: row.original.id }), {
              preserveScroll: true,
            });
          }}
          isProjectTable={true}
          isCreator={row.original.createdBy.id === user.id}
          canEdit={projects.permissions[row.original.id]}
        />
      ),
    },
  ];

  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        variant: "success",
        description: success,
      });
    }
  }, [success]);

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

      <main className="mx-auto max-w-7xl space-y-8 py-8">
        <section className="gap-6 px-3 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Projects Efficiently</CardTitle>
            </CardHeader>
            <CardContent>
              <h4>
                Track progress, manage tasks, and collaborate with your team. Use the
                tools provided to create, view, and update your projects seamlessly.
              </h4>
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                <Link href={route("project.create")}>
                  <Button className="w-full shadow sm:w-auto">
                    <CirclePlus className="h-5 w-5" />
                    <span>Create Project</span>
                  </Button>
                </Link>
                <Link href={route("project.invitations")}>
                  <Button variant="secondary" className="w-full shadow sm:w-auto">
                    <UsersRound className="h-5 w-5" />
                    <span>Invitations</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {allProjects.length > 0 ? (
          <section className="px-3 sm:px-6 lg:px-8">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 shadow-sm">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="flex flex-col gap-6">
                  <ProjectCards
                    projects={allProjects}
                    permissions={projects.permissions}
                    userId={user.id}
                  />
                  <ProjectStats projects={allProjects} />
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-6">
                <div className="overflow-x-auto rounded-lg border bg-card text-card-foreground shadow-sm">
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
              </TabsContent>
            </Tabs>
          </section>
        ) : (
          <section className="px-3 sm:px-6 lg:px-8">
            <Card className="flex-1">
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <FolderPlus className="h-8 w-8 text-muted-foreground" />
                <div className="flex flex-col gap-1.5">
                  <CardTitle>No Projects Yet</CardTitle>
                  <p className="text-base text-muted-foreground">
                    Get started by creating your first project. Projects help you
                    organize and track your tasks efficiently.
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={route("project.create")}>
                  <Button className="w-full sm:w-auto">
                    <CirclePlus className="h-5 w-5" />
                    Create Your First Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </AuthenticatedLayout>
  );
}
