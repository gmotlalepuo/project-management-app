import { Task } from "@/types/task";
import { TaskDescription } from "./TaskDescription";
import { TaskComments } from "./TaskComments";

type TaskContentProps = {
  task: Task;
};

export function TaskContent({ task }: TaskContentProps) {
  return (
    <div className="space-y-6">
      <TaskDescription task={task} />
      <TaskComments task={task} />
    </div>
  );
}
