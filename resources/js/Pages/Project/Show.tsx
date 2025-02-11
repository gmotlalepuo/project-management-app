import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import ProjectInfo from "./Partials/ProjectInfo";
import InviteUsers from "./Partials/InviteUsers";
import ProjectTasks from "./Partials/ProjectTasks";
import { Project } from "@/types/project";
import { PaginatedTask } from "@/types/task";
import { QueryParams } from "@/types/utils";
import { toast } from "@/hooks/use-toast";

type Props = {
  project: Project;
  tasks: PaginatedTask;
  error: string | null;
  success: string | null;
  queryParams: QueryParams;
  activeTab: string;
  labelOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  permissions: {
    canInviteUsers: boolean;
    canEditProject: boolean;
    canManageTasks: boolean;
  };
};

export default function Show({
  project,
  tasks,
  success,
  queryParams,
  error: serverError,
  activeTab: initialActiveTab,
  permissions,
  labelOptions,
  statusOptions,
}: Props) {
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
      const tab = url.searchParams.get("tab") || "tasks";
      setActiveTab(tab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        variant: "success",
        description: success,
      });
    }
  }, [success]);

  // Update handleInviteClick
  const handleInviteClick = () => {
    handleTabChange("invite");
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            {`Project "${project.name}"`}
          </h2>
        </div>
      }
    >
      <Head title={`Project "${project.name}"`} />

      <div className="space-y-12 py-8">
        <div className="mx-auto max-w-7xl space-y-6 px-3 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid auto-cols-[minmax(0,_2fr)] grid-flow-col shadow-sm">
              <TabsTrigger value="tasks">Project Tasks</TabsTrigger>
              <TabsTrigger value="info">Project Info</TabsTrigger>
              {permissions.canInviteUsers && (
                <TabsTrigger value="invite">Invite Users</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="tasks">
              <ProjectTasks
                tasks={tasks}
                queryParams={queryParams}
                projectId={project.id}
                permissions={permissions}
                labelOptions={labelOptions}
                statusOptions={statusOptions}
              />
            </TabsContent>
            <TabsContent value="info">
              <ProjectInfo
                project={project}
                onInviteClick={handleInviteClick}
                permissions={permissions}
              />
            </TabsContent>
            <TabsContent value="invite">
              <InviteUsers project={project} serverError={serverError} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
