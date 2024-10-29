import ApplicationLogo from "@/Components/ApplicationLogo";
import { ModeToggle } from "@/Components/ModeToggle";
import { PageProps } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode } from "react";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Separator } from "@/Components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/Components/ui/navigation-menu";
import { NavLink } from "@/Components/NavLink";
import { cn } from "@/lib/utils";

export default function AuthenticatedLayout({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  const user = usePage<PageProps>().props.auth.user;

  return (
    <div className="min-h-screen bg-accent">
      <nav className="border-b bg-background shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link href="/">
                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
              </Link>
              <NavigationMenu>
                <NavigationMenuList className="hidden space-x-2 md:flex">
                  <NavigationMenuItem>
                    <NavLink
                      href={route("dashboard")}
                      isActive={route().current("dashboard")}
                    >
                      Dashboard
                    </NavLink>
                  </NavigationMenuItem>

                  {/* Projects and Invitations Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="violetNav"
                        className={cn(
                          (route().current("project.index") ||
                            route().current("project.invitations")) &&
                            "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-100",
                        )}
                      >
                        <span>Projects</span>
                        <svg
                          className="ml-1 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href={route("project.index")}>All Projects</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={route("project.invitations")}>
                          Invitations
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Tasks Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="violetNav"
                        className={cn(
                          (route().current("task.index") ||
                            route().current("task.myTasks")) &&
                            "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-100",
                        )}
                      >
                        <span>Tasks</span>
                        <svg
                          className="ml-1 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href={route("task.index")}>All Tasks</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={route("task.myTasks")}>My Tasks</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <NavigationMenuItem>
                    <NavLink
                      href={route("user.index")}
                      isActive={route().current("user.index")}
                    >
                      Users
                    </NavLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* User Profile Dropdown and Dark Mode Toggle */}
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="violetNav"
                    className={cn(
                      route().current("profile.edit") &&
                        "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-100",
                    )}
                  >
                    <span>{user.name}</span>
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={route("profile.edit")}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={route("logout")}
                      method="post"
                      as="button"
                      className="w-full"
                    >
                      Log Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Navigation Button */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost">
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="space-y-4">
                    <Link href={route("dashboard")} className="block">
                      Dashboard
                    </Link>
                    <Link href={route("project.index")} className="block">
                      Projects
                    </Link>
                    <Link href={route("project.invitations")} className="block">
                      Invitations
                    </Link>
                    <Link href={route("task.index")} className="block">
                      All Tasks
                    </Link>
                    <Link href={route("task.myTasks")} className="block">
                      My Tasks
                    </Link>
                    <Link href={route("user.index")} className="block">
                      Users
                    </Link>
                    <Separator />
                    <Link href={route("profile.edit")} className="block">
                      Profile
                    </Link>
                    <Link
                      href={route("logout")}
                      method="post"
                      as="button"
                      className="block"
                    >
                      Log Out
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      {header && (
        <header className="bg-background shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
