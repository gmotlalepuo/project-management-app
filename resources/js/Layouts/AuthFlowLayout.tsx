import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AuthFlowLayout({ children }: PropsWithChildren) {
  const { props } = usePage();
  const { toast } = useToast();
  const errorMessages = Object.values(props.errors || {});
  const shownErrors = useRef<Set<string>>(new Set());

  useEffect(() => {
    errorMessages.forEach((errorMessage) => {
      if (errorMessage && !shownErrors.current.has(errorMessage as string)) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        shownErrors.current.add(errorMessage as string);
      }
    });

    // Clear shown errors when there are no error messages
    if (errorMessages.length === 0) {
      shownErrors.current.clear();
    }
  }, [errorMessages, toast]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-secondary pt-6 sm:justify-center sm:pt-0">
      <div>
        <Link href="/" className="flex items-center justify-center gap-3">
          <ApplicationLogo variant="circular" className="h-16 w-16" />
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-extrabold text-foreground">TeamSync</h2>
            <p className="text-sm text-muted-foreground">Your team, your way.</p>
          </div>
        </Link>
      </div>

      <div className="w-full overflow-hidden px-4 py-6 sm:max-w-md">{children}</div>
    </div>
  );
}
