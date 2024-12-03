import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Link, router } from "@inertiajs/react";
import { formatDate } from "@/utils/helpers";
import { Project } from "@/types/project";
import { Label } from "@/types/task";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import { Row } from "@tanstack/react-table";

type ProjectCardsProps = {
  projects: Project[];
  permissions: { [key: number]: boolean };
  userId: number;
};

export default function ProjectCards({
  projects,
  permissions,
  userId,
}: ProjectCardsProps) {
  const calculateTaskProgress = (totalTasks: number, completedTasks: number) => {
    return totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  };

  return (
    <div
      className={`grid flex-1 gap-6 ${projects.length > 1 ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}
    >
      {projects.slice(0, 6).map((project) => (
        <div key={project.id} className="rounded-lg bg-card p-5 shadow">
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
                onView={() => router.get(route("project.show", project.id))}
                onEdit={() => router.get(route("project.edit", project.id))}
                onDelete={() => router.delete(route("project.destroy", project.id))}
                onLeave={() => {
                  router.post(route("project.leave", { project: project.id }), {
                    preserveScroll: true,
                  });
                }}
                isProjectTable={true}
                isCreator={project.created_by === userId}
                canEdit={permissions[project.id]}
              />
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Created on {formatDate(project.created_at)}
          </p>

          <ul className="mt-3 space-y-1 text-sm text-gray-800 dark:text-gray-200">
            {project.tasks
              .sort((a, b) => a.name.localeCompare(b.name))
              .slice(0, 5)
              .map((task) => (
                <li key={task.id} className="truncate">
                  {task.labels?.map((label: Label) => (
                    <Badge key={label.id} variant={label.variant} className="mr-1">
                      {label.name}
                    </Badge>
                  ))}
                  <Link
                    href={route("task.show", task.id)}
                    className={task.status === "completed" ? "line-through" : ""}
                  >
                    {task.name}
                  </Link>
                </li>
              ))}
            {project.tasks.length > 5 && (
              <li className="text-gray-500">+ more tasks...</li>
            )}
          </ul>

          <div className="mt-3">
            <Progress
              value={calculateTaskProgress(
                project.total_tasks,
                project.completed_tasks,
              )}
              className="h-2"
            />
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {calculateTaskProgress(
                project.total_tasks,
                project.completed_tasks,
              ).toFixed(0)}
              % Complete
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
