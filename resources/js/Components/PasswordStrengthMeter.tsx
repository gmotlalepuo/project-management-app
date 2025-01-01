import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import React from "react";

interface PasswordStrengthMeterProps {
  password: string;
  onValidationChange?: (isValid: boolean) => void;
}

export default function PasswordStrengthMeter({
  password,
  onValidationChange,
}: PasswordStrengthMeterProps) {
  const requirements = [
    {
      text: "At least 8 characters",
      validator: (pass: string) => pass.length >= 8,
    },
    {
      text: "Contains letters",
      validator: (pass: string) => /[a-zA-Z]/.test(pass),
    },
    {
      text: "Contains numbers",
      validator: (pass: string) => /[0-9]/.test(pass),
    },
    {
      text: "Contains symbols",
      validator: (pass: string) => /[@$!%*#?&]/.test(pass),
    },
  ];

  // Check if all requirements are met whenever password changes
  React.useEffect(() => {
    const isValid = requirements.every((req) => req.validator(password));
    onValidationChange?.(isValid);
  }, [password, onValidationChange]);

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full transition-all",
              password.length === 0
                ? "bg-zinc-400 dark:bg-zinc-400"
                : i < getPasswordStrength(password)
                  ? "bg-primary"
                  : "bg-zinc-400 dark:bg-zinc-400",
            )}
          />
        ))}
      </div>
      <ul className="space-y-1 text-sm">
        {requirements.map((requirement, index) => (
          <li
            key={index}
            className={cn(
              "flex items-center gap-2",
              requirement.validator(password)
                ? "text-primary"
                : "font-bold text-zinc-500 dark:text-zinc-400",
            )}
          >
            {requirement.validator(password) ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            {requirement.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function getPasswordStrength(password: string): number {
  const requirements = [
    (pass: string) => pass.length >= 8,
    (pass: string) => /[a-zA-Z]/.test(pass),
    (pass: string) => /[0-9]/.test(pass),
    (pass: string) => /[@$!%*#?&]/.test(pass),
  ];

  return requirements.filter((req) => req(password)).length;
}
