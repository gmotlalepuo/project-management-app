import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Task } from "@/types/task";
import { TaskHeader } from "./Partials/TaskHeader";
import { TaskContent } from "./Partials/TaskContent";
import { TaskSidebar } from "./Partials/TaskSidebar";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

type Props = {
  task: Task;
  success?: string | null;
};

export default function Show({ task, success }: Props) {
  const { toast } = useToast();

  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        description: success,
        variant: "success",
      });
    }
  }, [success]);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Task #{task.task_number}
        </h2>
      }
    >
      <Head title={`Task #${task.task_number} - ${task.name}`} />

      <div className="py-6">
        <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          <TaskHeader task={task} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TaskContent task={task} />
            </div>
            <div className="lg:col-span-1">
              <TaskSidebar task={task} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
