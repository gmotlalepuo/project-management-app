import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import {
  TASK_PRIORITY_BADGE_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_BADGE_MAP,
  TASK_STATUS_TEXT_MAP,
} from "@/utils/constants";
import { formatDate } from "@/utils/helpers";
import { Task } from "@/types/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { User } from "@/types/user";

// Add helper function at the top of the file
const getUserDisplayInfo = (user: User | null) => {
  if (!user) {
    return {
      name: "Unassigned",
      email: "",
      profile_picture: null,
    };
  }
  return user;
};

type Props = {
  task: Task;
};

export default function Show({ task }: Props) {
  // Use the helper function when displaying assigned user info
  const assignedUserInfo = getUserDisplayInfo(task.assignedUser);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          {`Task "${task.name}"`}
        </h2>
      }
    >
      <Head title={`Task "${task.name}"`} />

      <div className="space-y-12 py-8">
        <div className="mx-auto max-w-7xl space-y-6 px-3 sm:px-6 lg:px-8">
          {task.image_path && (
            <img
              src={task.image_path}
              alt="Task Image"
              className="mb-6 h-64 w-full rounded-lg object-cover shadow-md"
            />
          )}

          <div className="space-y-6 rounded-lg bg-white p-6 shadow-lg dark:bg-card dark:text-gray-100">
            {/* Task Information Card */}
            <Card className="bg-gray-50 dark:bg-gray-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Task Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Task ID</Label>
                  <p className="text-gray-700 dark:text-gray-300">{task.id}</p>
                </div>
                <div>
                  <Label>Task Name</Label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {task.name}
                  </p>
                </div>
                <div className="flex flex-col items-baseline space-y-3">
                  <Label>Task Status</Label>
                  <Badge variant={TASK_STATUS_BADGE_MAP[task.status]}>
                    {TASK_STATUS_TEXT_MAP[task.status]}
                  </Badge>
                </div>
                <div className="flex flex-col items-baseline space-y-3">
                  <Label>Task Priority</Label>
                  <Badge variant={TASK_PRIORITY_BADGE_MAP[task.priority]}>
                    {TASK_PRIORITY_TEXT_MAP[task.priority]}
                  </Badge>
                </div>
                <div>
                  <Label>Created By</Label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {task.createdBy.name}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Task Timeline Card */}
            <Card className="bg-gray-50 dark:bg-gray-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Task Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Due Date</Label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {formatDate(task.due_date)}
                  </p>
                </div>
                <div>
                  <Label>Created At</Label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {formatDate(task.created_at)}
                  </p>
                </div>
                <div>
                  <Label>Updated By</Label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {task.updatedBy.name}
                  </p>
                </div>
                <div>
                  <Label>Project</Label>
                  <p className="mt-1 hover:underline">
                    <Link href={route("project.show", task.project.id)}>
                      {task.project.name}
                    </Link>
                  </p>
                </div>
                <div>
                  <Label>Assigned To</Label>
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage
                        src={assignedUserInfo.profile_picture ?? undefined}
                        alt={assignedUserInfo.name}
                      />
                      <AvatarFallback>
                        {assignedUserInfo.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-gray-700 dark:text-gray-300">
                      {assignedUserInfo.name}
                      {assignedUserInfo.email && ` (${assignedUserInfo.email})`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task Description Card */}
            <Card className="bg-gray-50 dark:bg-gray-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Task Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  {task.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
