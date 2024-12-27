import { Link } from "@inertiajs/react";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";

export const Cta = () => {
  return (
    <section id="cta" className="my-24 bg-muted/50 py-16 sm:my-32">
      <div className="container mx-auto max-w-7xl place-items-center px-4 lg:grid lg:grid-cols-2">
        <div className="lg:col-start-1">
          <h2 className="text-3xl font-bold md:text-4xl">
            Start Managing Your
            <span className="bg-gradient-to-b from-primary/60 to-primary bg-clip-text text-transparent">
              {" "}
              Projects Better{" "}
            </span>
            Today
          </h2>
          <p className="mb-8 mt-4 text-xl text-muted-foreground lg:mb-0">
            Join hundreds of teams who use TeamSync to streamline their project
            workflows, enhance collaboration, and deliver results faster. Get started
            for free!
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 lg:col-start-2 lg:flex-row lg:items-center lg:justify-center">
          <Link href={route("register")}>
            <Button size="lg" className="w-full md:w-auto">
              Get Started
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg" className="w-full md:w-auto">
              <span>Learn more</span>
              <ArrowUp className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
