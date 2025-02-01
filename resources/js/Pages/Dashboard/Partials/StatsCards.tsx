import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ClipboardList, Timer, CheckCircle2 } from "lucide-react";

type StatsCardsProps = {
  stats: {
    slug: string;
    total: number;
    mine: number;
  }[];
};

export function StatsCards({ stats }: StatsCardsProps) {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((status) => (
        <Card key={status.slug}>
          <CardHeader className="flex flex-row items-center gap-3">
            {status.slug === "pending" && (
              <>
                <ClipboardList className="h-6 w-6 text-amber-500" />
                <CardTitle className="!m-0 text-amber-500">Pending Tasks</CardTitle>
              </>
            )}
            {status.slug === "in_progress" && (
              <>
                <Timer className="h-6 w-6 text-blue-500" />
                <CardTitle className="!m-0 text-blue-500">
                  In Progress Tasks
                </CardTitle>
              </>
            )}
            {status.slug === "completed" && (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <CardTitle className="!m-0 text-green-500">
                  Completed Tasks
                </CardTitle>
              </>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-xl">
              <span className="mr-2">{status.mine}</span>/
              <span className="ml-2">{status.total}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Tasks assigned to you / Total tasks in your projects
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
