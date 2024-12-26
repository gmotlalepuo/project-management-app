import { ClipboardList } from "lucide-react";
import { Statistics } from "./Statistics";

export const About = () => {
  return (
    <section id="about" className="container mx-auto max-w-7xl px-4 py-24 sm:py-32">
      <div className="rounded-lg border bg-muted/50 px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          {/* Icon Column */}
          <div className="flex items-center justify-center md:w-1/4">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl" />
              <div className="relative rounded-full bg-primary/10 p-8">
                <ClipboardList className="h-16 w-16 text-primary lg:h-24 lg:w-24" />
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex flex-1 flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold md:text-4xl">
                Streamline Your{" "}
                <span className="bg-gradient-to-b from-primary/60 to-primary bg-clip-text text-transparent">
                  Project Management
                </span>
              </h2>
              <p className="text-lg text-muted-foreground md:text-xl">
                TeamSync brings together everything your team needs - from task
                tracking to real-time collaboration. Our intuitive platform helps
                teams stay organized, focused, and productive with features like
                customizable labels, task discussions, and project tracking.
              </p>
            </div>

            <div className="mt-12">
              <Statistics />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
