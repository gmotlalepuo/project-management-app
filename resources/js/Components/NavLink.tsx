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
        "relative rounded-md px-3 py-2 text-gray-600 transition-colors duration-200 hover:bg-violet-100 hover:text-violet-600 dark:text-gray-300 dark:hover:bg-violet-950 dark:hover:text-violet-300",
        isActive && "dark:!text-primary-light font-bold !text-primary",
      )}
    >
      {children}
      {isActive && (
        <span className="dark:bg-primary-light absolute bottom-[-14px] left-0 right-0 h-0.5 bg-primary" />
      )}
    </Link>
  );
};
