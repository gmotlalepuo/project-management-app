import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { formatDate } from "@/utils/helpers";
import { Task } from "@/types/task";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { UserPlus, UserMinus } from "lucide-react";
import { Badge } from "@/Components/ui/badge";

type TaskSidebarProps = {
  task: Task;
};

export function TaskSidebar({ task }: TaskSidebarProps) {
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const handleAssign = () => {
    showConfirmation({
      title: "Assign Task",
      description: "Are you sure you want to assign this task to yourself?",
      action: () => router.post(route("task.assignToMe", task.id)),
      actionText: "Assign",
    });
  };

  const handleUnassign = () => {
    showConfirmation({
      title: "Unassign Task",
      description: "Are you sure you want to unassign yourself from this task?",
      action: () => router.post(route("task.unassign", task.id)),
      actionText: "Unassign",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl">Task Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 divide-y px-4 pb-4 sm:px-6 sm:pb-6">
          {/* Assignee Section */}
          <div>
            <h4 className="mb-3 text-sm font-medium">Assignee</h4>
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAssign}
                    className="flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Assign to me</span>
                  </Button>
                )}
                {task.can.unassign && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUnassign}
                    className="flex items-center gap-2"
                  >
                    <UserMinus className="h-4 w-4" />
                    <span>Unassign</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Labels Section */}
          {task.labels && task.labels.length > 0 && (
            <div>
              <h4 className="my-3 text-sm font-medium">Labels</h4>
              <div className="flex flex-wrap gap-2">
                {task.labels.map((label) => (
                  <Badge key={label.id} variant={label.variant} size="small">
                    {label.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Due Date */}
          <div>
            <h4 className="my-3 text-sm font-medium">Due Date</h4>
            <p className="text-muted-foreground">
              {task.due_date ? formatDate(task.due_date) : "No due date set"}
            </p>
          </div>

          {/* Created By */}
          <div>
            <h4 className="my-3 text-sm font-medium">Created By</h4>
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
            <h4 className="my-3 text-sm font-medium">Last Updated By</h4>
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

      <ConfirmationDialog />
    </div>
  );
}
