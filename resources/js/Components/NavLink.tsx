import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { ReactNode } from "react";

export const NavLink = ({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: ReactNode;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "relative rounded-md px-4 py-3 text-sm text-gray-600 transition-colors duration-200 hover:bg-violet-100 hover:text-violet-600 dark:text-gray-300 dark:hover:bg-violet-950 dark:hover:text-violet-300",
        isActive &&
          "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-100",
      )}
    >
      {children}
    </Link>
  );
};
