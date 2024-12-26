import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ClipboardList, Users2, Tags, MessageSquare } from "lucide-react";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <ClipboardList className="h-12 w-12 text-primary" />,
    title: "Task Management",
    description:
      "Create, assign, and track tasks effortlessly. Keep your projects organized with our intuitive task management system.",
  },
  {
    icon: <Users2 className="h-12 w-12 text-primary" />,
    title: "Team Collaboration",
    description:
      "Work together seamlessly with real-time updates and collaborative features designed for modern teams.",
  },
  {
    icon: <Tags className="h-12 w-12 text-primary" />,
    title: "Smart Labels",
    description:
      "Organize and categorize tasks with custom labels. Filter and search tasks efficiently to stay on top of priorities.",
  },
  {
    icon: <MessageSquare className="h-12 w-12 text-primary" />,
    title: "Task Discussions",
    description:
      "Keep all task-related communications in one place with threaded discussions and notifications.",
  },
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container mx-auto max-w-7xl px-4 py-16 text-center sm:py-24"
    >
      <h2 className="text-center text-3xl font-bold md:text-4xl">
        <span className="bg-gradient-to-b from-primary/60 to-primary bg-clip-text text-transparent">
          Powerful Features
        </span>{" "}
        for Productive Teams
      </h2>

      <p className="mx-auto mt-4 max-w-[85%] text-center text-xl text-muted-foreground">
        Everything you need to manage projects effectively and keep your team in sync
      </p>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon, title, description }) => (
          <Card key={title} className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-primary/10 p-4">{icon}</div>
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              {description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
