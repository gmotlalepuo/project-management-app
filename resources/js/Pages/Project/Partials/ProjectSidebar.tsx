import { Link } from "@inertiajs/react";
import { Project } from "@/types/project";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { PieChart, Pie, Label as RechartsLabel } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart";

const chartConfig = {
  count: { label: "Projects" },
  completed: { label: "Completed", color: "hsl(var(--success))" },
  in_progress: { label: "In Progress", color: "hsl(var(--info))" },
  pending: { label: "Pending", color: "hsl(var(--warning))" },
} satisfies ChartConfig;

interface ProjectSidebarProps {
  projects: Project[];
}

export default function ProjectSidebar({ projects }: ProjectSidebarProps) {
  const prepareChartData = (projects: Project[]) => {
    const statusCounts = {
      completed: projects.filter((p) => p.status === "completed").length,
      in_progress: projects.filter((p) => p.status === "in_progress").length,
      pending: projects.filter((p) => p.status === "pending").length,
    };

    return [
      {
        status: "completed",
        count: statusCounts.completed,
        fill: "hsl(var(--chart-2))",
      },
      {
        status: "in_progress",
        count: statusCounts.in_progress,
        fill: "hsl(var(--chart-1))",
      },
      {
        status: "pending",
        count: statusCounts.pending,
        fill: "hsl(var(--chart-3))",
      },
    ];
  };

  return (
    <div
      className={`grid flex-1 gap-6 ${projects.some((project) => project.status === "completed") ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}
    >
      {projects.length > 0 && (
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Project Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart accessibilityLayer>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Pie
                  data={prepareChartData(projects)}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={65}
                  strokeWidth={2}
                >
                  <RechartsLabel
                    content={({ viewBox }) => {
                      const total = projects.length;
                      const completed = projects.filter(
                        (project) => project.status === "completed",
                      ).length;
                      const percentage = ((completed / total) * 100).toFixed(0);

                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-xl font-bold"
                            >
                              {percentage}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-sm"
                            >
                              Completed
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 pt-2 text-sm">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="font-medium">{projects.length}</p>
                <p className="text-muted-foreground">Total</p>
              </div>
              <div>
                <p className="font-medium">
                  {projects.filter((p) => p.status === "completed").length}
                </p>
                <p className="text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}

      {projects.some((project) => project.status === "completed") && (
        <div className="rounded-lg bg-card p-4 shadow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Recently Completed Projects
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {projects
              .filter((project) => project.status === "completed")
              .slice(0, 3)
              .map((project) => (
                <li key={project.id} className="flex items-center">
                  <Link
                    href={route("project.show", project.id)}
                    className="hover:underline"
                  >
                    {project.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
