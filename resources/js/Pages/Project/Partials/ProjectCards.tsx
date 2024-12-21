import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Link, router } from "@inertiajs/react";
import { formatDate } from "@/utils/helpers";
import { Project } from "@/types/project";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import { Row } from "@tanstack/react-table";
import { Plus, UsersRound } from "lucide-react";

import { STATUS_CONFIG, type StatusType } from "@/utils/constants";

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
    <div className="grid flex-1 gap-6 sm:grid-cols-2">
      {projects.slice(0, 6).map((project) => {
        const StatusIcon = STATUS_CONFIG[project.status as StatusType].icon;

        return (
          <div key={project.id} className="min-w-0 rounded-lg bg-card p-5 shadow">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <Link
                  href={route("project.show", project.id)}
                  className="truncate text-lg font-semibold"
                >
                  {project.name}
                </Link>
                <span
                  className="shrink-0"
                  title={STATUS_CONFIG[project.status as StatusType].text}
                >
                  <StatusIcon
                    className={`h-5 w-5 ${STATUS_CONFIG[project.status as StatusType].color}`}
                  />
                </span>
              </div>
              <span className="shrink-0">
                <DataTableRowActions
                  row={{ original: project } as Row<Project>}
                  onView={() => router.get(route("project.show", project.id))}
                  onEdit={() => router.get(route("project.edit", project.id))}
                  onDelete={() =>
                    router.delete(route("project.destroy", project.id))
                  }
                  onLeave={() => {
                    router.post(route("project.leave", { project: project.id }), {
                      preserveScroll: true,
                    });
                  }}
                  isProjectTable={true}
                  isCreator={project.created_by === userId}
                  canEdit={permissions[project.id]}
                  customActions={[
                    {
                      icon: Plus,
                      label: "Create Task",
                      onClick: (row) =>
                        router.get(
                          route("task.create", {
                            project_id: row.original.id,
                          }),
                        ),
                    },
                    ...(permissions[project.id]
                      ? [
                          {
                            icon: UsersRound,
                            label: "Invite User",
                            onClick: (row: Row<Project>) =>
                              router.get(
                                route("project.show", {
                                  project: row.original.id,
                                  tab: "invite",
                                }),
                              ),
                          },
                        ]
                      : []),
                  ]}
                />
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Created on {formatDate(project.created_at)}
            </p>

            <ul className="mt-3 space-y-1.5 text-sm text-gray-800 dark:text-gray-200">
              {project.tasks
                .sort((a, b) => a.name.localeCompare(b.name))
                .slice(0, 5)
                .map((task) => {
                  const TaskStatusIcon =
                    STATUS_CONFIG[task.status as StatusType].icon;
                  const primaryLabel = task.labels?.[0];

                  return (
                    <li key={task.id} className="min-w-0">
                      <Link
                        className="group flex min-w-0 items-center gap-2 rounded-md p-1 transition-colors hover:bg-accent/50"
                        href={route("task.show", task.id)}
                        title={task.name}
                      >
                        <span
                          className="shrink-0"
                          title={STATUS_CONFIG[task.status as StatusType].text}
                        >
                          <TaskStatusIcon
                            className={`h-4 w-4 ${STATUS_CONFIG[task.status as StatusType].color}`}
                          />
                        </span>
                        <span
                          className={`min-w-0 flex-1 truncate ${
                            task.status === "completed" ? "line-through" : ""
                          }`}
                        >
                          {task.name}
                        </span>
                        {primaryLabel && (
                          <Badge variant={primaryLabel.variant} className="shrink-0">
                            {primaryLabel.name}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  );
                })}
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
        );
      })}
    </div>
  );
}
