import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ClipboardList, Timer, CheckCircle2 } from "lucide-react";

type StatsCardsProps = {
  totalPendingTasks: number;
  myPendingTasks: number;
  totalProgressTasks: number;
  myProgressTasks: number;
  totalCompletedTasks: number;
  myCompletedTasks: number;
};

export function StatsCards({
  totalPendingTasks,
  myPendingTasks,
  totalProgressTasks,
  myProgressTasks,
  totalCompletedTasks,
  myCompletedTasks,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <ClipboardList className="h-6 w-6 text-amber-500" />
          <CardTitle className="!m-0 text-amber-500">Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl">
            <span className="mr-2">{myPendingTasks}</span>/
            <span className="ml-2">{totalPendingTasks}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Tasks assigned to you / Total tasks in your projects
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Timer className="h-6 w-6 text-blue-500" />
          <CardTitle className="!m-0 text-blue-500">In Progress Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl">
            <span className="mr-2">{myProgressTasks}</span>/
            <span className="ml-2">{totalProgressTasks}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Tasks assigned to you / Total tasks in your projects
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          <CardTitle className="!m-0 text-green-500">Completed Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl">
            <span className="mr-2">{myCompletedTasks}</span>/
            <span className="ml-2">{totalCompletedTasks}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Tasks assigned to you / Total tasks in your projects
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
