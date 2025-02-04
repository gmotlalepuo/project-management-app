import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Project } from "@/types/project";
import { KanbanBoard } from "./Partials/KanbanBoard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { KanbanColumn } from "@/types/kanban";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Settings, Info, CirclePlus } from "lucide-react";
import { ReorderColumnsDialog } from "./Partials/ReorderColumnsDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

type Props = {
  project: Project;
  columns: KanbanColumn[];
  permissions: {
    canManageTasks: boolean;
    canManageBoard: boolean;
  };
  success?: string | null;
  error?: string | null;
};

export default function Kanban({
  project,
  columns,
  permissions,
  success,
  error,
}: Props) {
  const { toast } = useToast();

  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        description: success,
        variant: "success",
      });
    }
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [success, error]);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          {project.name} - Kanban Board
        </h2>
      }
    >
      <Head title={`${project.name} - Kanban Board`} />

      <div className="py-8">
        {/* Top level container with no horizontal constraints */}
        <div className="space-y-6">
          {/* Info card section with max width */}
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center md:gap-2">
                  <div>
                    <CardTitle>Project Tasks</CardTitle>
                    <CardDescription className="mt-1.5">
                      Project:{" "}
                      <Link
                        className="hover:underline"
                        href={route("project.show", project.id)}
                      >
                        <span className="text-secondary-foreground">
                          {project.name}
                        </span>
                      </Link>
                    </CardDescription>
                  </div>
                  <Link href={route("task.create", { project_id: project.id })}>
                    <Button className="w-full shadow md:w-auto">
                      <CirclePlus className="h-4 w-4" />
                      Create Task
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="about"
                  className="rounded-lg border bg-secondary px-4 dark:bg-secondary/30"
                >
                  <AccordionItem value="about">
                    <AccordionTrigger className="flex justify-start gap-1.5">
                      <Info className="h-4 w-4" />
                      <span className="font-medium">About Kanban Board</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        <li>
                          Drag and drop tasks between columns to update their status
                        </li>
                        <li>Click the task card to view more details</li>
                        <li>Create new tasks directly in any column</li>
                        {permissions.canManageBoard && (
                          <>
                            <li>Manage task statuses to customize your board</li>
                            <li>Reorder columns to match your workflow</li>
                          </>
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  {permissions.canManageBoard && (
                    <>
                      <Link href={route("project.statuses.index", project.id)}>
                        <Button
                          variant="outline"
                          className="w-full shadow md:w-auto"
                        >
                          <Settings className="h-4 w-4" />
                          Manage Statuses
                        </Button>
                      </Link>
                      <ReorderColumnsDialog
                        columns={columns}
                        projectId={project.id}
                      />
                    </>
                  )}
                  <Link href={route("project.show", project.id)}>
                    <Button variant="outline" className="w-full shadow md:w-auto">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Project
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kanban board section with its own scroll container */}
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto rounded-lg">
              <KanbanBoard
                columns={columns}
                projectId={project.id}
                permissions={permissions}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
