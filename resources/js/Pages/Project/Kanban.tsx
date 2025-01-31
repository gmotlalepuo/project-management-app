import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Project } from "@/types/project";
import { KanbanBoard } from "./Partials/KanbanBoard";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { KanbanColumn } from "@/types/kanban";

type Props = {
  project: Project;
  columns: KanbanColumn[];
  permissions: {
    canManageTasks: boolean;
    canManageBoard: boolean;
  };
};

export default function Kanban({ project, columns, permissions }: Props) {
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <KanbanBoard
                columns={columns}
                projectId={project.id}
                permissions={permissions}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
