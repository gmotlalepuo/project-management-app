import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Project } from "@/types/project";
import { PaginatedTaskStatus } from "@/types/task";
import { QueryParams } from "@/types/utils";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, CirclePlus, Info } from "lucide-react";
import StatusesList from "./Partials/StatusesList";

type Props = {
  project: Pick<Project, "id" | "name">;
  statuses: PaginatedTaskStatus;
  success: string | null;
  error: string | null;
  queryParams: QueryParams;
};

export default function Index({
  project,
  statuses,
  success,
  error,
  queryParams,
}: Props) {
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
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: error,
      });
    }
  }, [success, error]);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Statuses for project "{project.name}"
        </h2>
      }
    >
      <Head title={`Statuses - ${project.name}`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl space-y-6 px-3 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center md:gap-2">
                <div>
                  <CardTitle>Project Statuses</CardTitle>
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
                <div className="flex flex-col gap-3 md:flex-row">
                  <Link href={route("project.statuses.create", project.id)}>
                    <Button className="w-full shadow md:w-auto">
                      <CirclePlus className="h-4 w-4" />
                      Create Status
                    </Button>
                  </Link>
                  <Link href={route("project.show", project.id)}>
                    <Button variant="outline" className="w-full shadow md:w-auto">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Project
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-secondary p-4 dark:bg-secondary/30">
                <div className="flex items-center gap-1.5">
                  <Info className="h-4 w-4" />
                  <h4 className="font-medium">About Statuses</h4>
                </div>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>
                    Task statuses help track the progress of tasks within your
                    project
                  </li>
                  <li>Project managers can create and manage custom statuses</li>
                  <li>Default statuses are available across all projects</li>
                  <li>You cannot modify or delete default statuses</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <StatusesList
            statuses={statuses}
            projectId={project.id}
            queryParams={queryParams}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
