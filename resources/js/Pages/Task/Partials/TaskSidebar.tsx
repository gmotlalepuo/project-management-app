import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { formatDate } from "@/utils/helpers";
import { Task } from "@/types/task";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";

type TaskSidebarProps = {
  task: Task;
};

export function TaskSidebar({ task }: TaskSidebarProps) {
  const handleAssign = () => {
    router.post(route("task.assignToMe", task.id));
  };

  const handleUnassign = () => {
    router.post(route("task.unassign", task.id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Assignee Section */}
          <div>
            <h4 className="mb-2 text-sm font-medium">Assignee</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {task.assignedUser ? (
                  <>
                    <Avatar>
                      <AvatarImage src={task.assignedUser.profile_picture} />
                      <AvatarFallback>
                        {task.assignedUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{task.assignedUser.name}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </div>
              <div>
                {task.can.assign && (
                  <Button size="sm" variant="outline" onClick={handleAssign}>
                    Assign to me
                  </Button>
                )}
                {task.can.unassign && (
                  <Button size="sm" variant="outline" onClick={handleUnassign}>
                    Unassign
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <h4 className="mb-1 text-sm font-medium">Due Date</h4>
            <p className="text-muted-foreground">
              {task.due_date ? formatDate(task.due_date) : "No due date set"}
            </p>
          </div>

          {/* Created By */}
          <div>
            <h4 className="mb-1 text-sm font-medium">Created By</h4>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={task.createdBy.profile_picture} />
                <AvatarFallback>{task.createdBy.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{task.createdBy.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(task.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div>
            <h4 className="mb-1 text-sm font-medium">Last Updated By</h4>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={task.updatedBy.profile_picture} />
                <AvatarFallback>{task.updatedBy.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{task.updatedBy.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(task.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
