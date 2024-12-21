import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PaginatedLabel } from "@/types/task";
import { Project } from "@/types/project";
import LabelList from "./Partials/LabelList";
import { QueryParams } from "@/types/utils";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type Props = {
  project: Pick<Project, "id" | "name">;
  labels: PaginatedLabel;
  success: string | null;
  queryParams: QueryParams;
};

export default function Index({ project, labels, success, queryParams }: Props) {
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

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Labels for project "{project.name}"
        </h2>
      }
    >
      <Head title={`Labels - ${project.name}`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl space-y-6 px-3 sm:px-6 lg:px-8">
          <LabelList
            labels={labels}
            projectId={project.id}
            queryParams={queryParams}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
