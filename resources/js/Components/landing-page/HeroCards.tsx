import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { ListTodo, MessageSquare, Tags, Users2 } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const HeroCards = () => {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2 md:grid-rows-[auto_auto] md:gap-6 lg:gap-8">
      {/* First Column */}
      <div className="space-y-6 lg:space-y-8">
        {/* Task Management Card - Always First */}
        <Card className="w-full shadow-black/10 drop-shadow-xl dark:shadow-white/10">
          <CardHeader className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <ListTodo className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Task Management</CardTitle>
              <CardDescription className="mt-2">
                Organize tasks efficiently with our intuitive project management
                tools.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Collaboration Card - Second on mobile, Last on desktop */}
        <div className="block md:hidden">
          <Card className="w-full shadow-black/10 drop-shadow-xl dark:shadow-white/10">
            <CardHeader className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Users2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription className="mt-2">
                  Connect with your team members and manage projects together in
                  real-time
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Features List Card - Third on mobile, Second on desktop */}
        <Card className="w-full shadow-black/10 drop-shadow-xl dark:shadow-white/10">
          <CardHeader>
            <div className="space-y-4">
              {[
                {
                  icon: <Users2 className="h-5 w-5" />,
                  text: "Real-time collaboration",
                },
                { icon: <Tags className="h-5 w-5" />, text: "Smart task labeling" },
                {
                  icon: <MessageSquare className="h-5 w-5" />,
                  text: "Task discussions",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-primary">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Second Column */}
      <div className="space-y-6 pt-8 lg:space-y-8">
        {/* Team Member Card - Fourth on mobile, Second on desktop */}
        <Card className="order-last w-full shadow-black/10 drop-shadow-xl dark:shadow-white/10 md:order-first">
          <CardHeader className="mt-8 flex items-center justify-center pb-2">
            <img
              src="https://i.pravatar.cc/150?img=58"
              alt="Frontend Developer Avatar"
              className="absolute -top-8 aspect-square h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20 md:h-24 md:w-24"
            />
            <CardTitle className="text-center">
              Petko G.
              <a
                rel="noreferrer noopener"
                href="https://github.com/leoMirandaa"
                target="_blank"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                <span className="sr-only">Github icon</span>
                <GitHubLogoIcon className="h-5 w-5" />
              </a>
            </CardTitle>
            <CardDescription className="font-normal text-primary">
              Web Developer
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6 text-center">
            <p>
              "TeamSync has transformed how our development team manages projects and
              collaborates."
            </p>
          </CardContent>
        </Card>

        {/* Collaboration Card - Hidden on mobile, shown here on desktop */}
        <div className="hidden md:block">
          <Card className="w-full shadow-black/10 drop-shadow-xl dark:shadow-white/10">
            <CardHeader className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Users2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription className="mt-2">
                  Connect with your team members and manage projects together in
                  real-time
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Background effect */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[100px] sm:h-[350px] sm:w-[350px]" />
    </div>
  );
};
