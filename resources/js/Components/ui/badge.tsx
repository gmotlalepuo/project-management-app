import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-nowrap",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        info: "border-transparent bg-blue-600 text-white ",
        success: "border-transparent bg-emerald-600 text-white",
        warning: "border-transparent bg-amber-600 text-white",
        low: "border-transparent bg-gray-600 text-white",
        medium: "border-transparent bg-amber-700 text-white",
        red: "border-red-500 bg-red-100 text-red-500 dark:bg-red-950 dark:text-red-200 dark:border-red-300",
        green:
          "border-green-500 bg-green-100 text-green-500 dark:bg-green-950 dark:text-green-200 dark:border-green-300",
        blue: "border-blue-500 bg-blue-100 text-blue-500 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-300",
        yellow:
          "border-yellow-500 bg-yellow-100 text-yellow-500 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-300",
        amber:
          "border-amber-500 bg-amber-100 text-amber-500 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-300",
        indigo:
          "border-indigo-500 bg-indigo-100 text-indigo-500 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-300",
        purple:
          "border-purple-500 bg-purple-100 text-purple-500 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-300",
        pink: "border-pink-500 bg-pink-100 text-pink-500 dark:bg-pink-950 dark:text-pink-200 dark:border-pink-300",
        teal: "border-teal-500 bg-teal-100 text-teal-500 dark:bg-teal-950 dark:text-teal-200 dark:border-teal-300",
        cyan: "border-cyan-500 bg-cyan-100 text-cyan-500 dark:bg-cyan-950 dark:text-cyan-200 dark:border-cyan-300",
        gray: "border-gray-500 bg-gray-100 text-gray-500 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-300",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        small: "px-2 py-0.25",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Export the badge variant type
export type BadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>["variant"]
>;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
