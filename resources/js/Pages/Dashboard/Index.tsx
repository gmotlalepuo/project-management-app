import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PaginatedTask, Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { CirclePlus, UsersRound, Layout, CheckSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { StatsCards } from "./Partials/StatsCards";
import { ActiveTasksTable } from "./Partials/ActiveTasksTable";
import { QueryParams } from "@/types/utils";

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
  projectOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
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
  statusOptions,
  projectOptions,
}: Props) {
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

  const stats = [
    { slug: "pending", total: totalPendingTasks, mine: myPendingTasks },
    { slug: "in_progress", total: totalProgressTasks, mine: myProgressTasks },
    { slug: "completed", total: totalCompletedTasks, mine: myCompletedTasks },
  ];

  const hasStats =
    totalPendingTasks > 0 || totalProgressTasks > 0 || totalCompletedTasks > 0;
  const hasActiveTasks = activeTasks.data.length > 0;
  const shouldShowTabs = hasStats || hasActiveTasks;

  // Determine default tab based on available data
  const defaultTab = hasActiveTasks ? "tasks" : "stats";

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
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to TeamSync!</CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="mb-4">
                Manage your projects and tasks efficiently. Start by creating a new
                project or task, or check your pending invitations.
              </h4>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Link href={route("project.create")}>
                  <Button className="w-full shadow sm:w-auto">
                    <CirclePlus className="mr-2 h-5 w-5" />
                    <span>Create Project</span>
                  </Button>
                </Link>
                <Link href={route("task.create")}>
                  <Button className="w-full shadow sm:w-auto">
                    <CheckSquare className="mr-2 h-5 w-5" />
                    <span>Create Task</span>
                  </Button>
                </Link>
                <Link href={route("project.invitations")}>
                  <Button variant="secondary" className="w-full shadow sm:w-auto">
                    <UsersRound className="mr-2 h-5 w-5" />
                    <span>Invitations</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

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

          {shouldShowTabs && (
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue={defaultTab} className="w-full">
                  <TabsList
                    className="grid w-full"
                    style={{
                      gridTemplateColumns: `repeat(${hasActiveTasks && hasStats ? 2 : 1}, 1fr)`,
                    }}
                  >
                    {hasActiveTasks && (
                      <TabsTrigger value="tasks">Active Tasks</TabsTrigger>
                    )}
                    {hasStats && <TabsTrigger value="stats">Statistics</TabsTrigger>}
                  </TabsList>

                  {hasActiveTasks && (
                    <TabsContent value="tasks" className="mt-4">
                      <ActiveTasksTable
                        activeTasks={activeTasks}
                        queryParams={queryParams}
                        labelOptions={labelOptions}
                        permissions={permissions}
                        projectOptions={projectOptions}
                        statusOptions={statusOptions}
                      />
                    </TabsContent>
                  )}

                  {hasStats && (
                    <TabsContent value="stats" className="mt-4">
                      <StatsCards stats={stats} />
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
