import { Head, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import ProjectInfo from "./Partials/ProjectInfo";
import InviteUsers from "./Partials/InviteUsers";
import ProjectTasks from "./Partials/ProjectTasks";
import { Project } from "@/types/project";
import { PaginatedTask } from "@/types/task";

type Props = {
  project: Project;
  tasks: PaginatedTask;
  error: string | null;
  success: string | null;
  queryParams: { [key: string]: any };
};

export default function Show({
  project,
  tasks,
  success,
  queryParams,
  error: serverError,
}: Props) {
  queryParams = queryParams || {};

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          {`Project "${project.name}"`}
        </h2>
      }
    >
      <Head title={`Project "${project.name}"`} />

      <div className="space-y-12 py-12">
        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tasks">Project Tasks</TabsTrigger>
              <TabsTrigger value="info">Project Info</TabsTrigger>
              <TabsTrigger value="invite">Invite Users</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
              <ProjectTasks
                tasks={tasks}
                queryParams={queryParams}
                projectId={project.id}
              />
            </TabsContent>
            <TabsContent value="info">
              <ProjectInfo project={project} />
            </TabsContent>
            <TabsContent value="invite">
              <InviteUsers
                project={project}
                success={success}
                serverError={serverError}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
