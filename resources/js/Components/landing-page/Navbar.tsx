import { useState } from "react";
import { Link } from "@inertiajs/react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/Components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/Components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "../ModeToggle";
import { Button } from "../ui/button";
import ApplicationLogo from "../ApplicationLogo";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#testimonials",
    label: "Testimonials",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b-[1px] bg-background shadow-sm dark:border-b-zinc-700 dark:bg-background dark:shadow-none">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container flex h-14 w-screen max-w-7xl items-center justify-between px-4">
          <NavigationMenuItem className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <ApplicationLogo variant="circular" className="h-8 w-8" />
              <span className="font-bold">TeamSync</span>
            </Link>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger
                className="px-2"
                title="Menu Icon"
                aria-label="Menu Icon"
              >
                <Menu className="h-5 w-5" onClick={() => setIsOpen(true)}></Menu>
              </SheetTrigger>

              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <ApplicationLogo variant="circular" className="h-8 w-8" />
                    <span className="font-bold">TeamSync</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col items-center gap-3">
                  {routeList.map(({ href, label }) => (
                    <a
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="text-sm transition-colors hover:text-primary"
                    >
                      {label}
                    </a>
                  ))}
                  <hr className="my-2 w-full" />
                  <Link href={route("login")} className="w-full">
                    <Button variant="ghost" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href={route("register")} className="w-full">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                  <a
                    href="https://github.com/your-username/your-repo"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      <GitHubLogoIcon className="h-4 w-4" />
                      GitHub
                    </Button>
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden items-center gap-6 md:flex">
            {routeList.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="text-sm transition-colors hover:text-primary"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <a
              href="https://github.com/stekatag/project-management-app"
              target="_blank"
              rel="noreferrer noopener"
              className="hidden lg:flex"
            >
              <Button variant="outline" size="sm">
                <GitHubLogoIcon className="h-4 w-4" />
                GitHub
              </Button>
            </a>
            <Link href={route("login")}>
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href={route("register")}>
              <Button>Get Started</Button>
            </Link>
            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
