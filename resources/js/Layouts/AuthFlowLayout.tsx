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
        <Link href="/">
          <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
        </Link>
      </div>

      <div className="mt-6 w-full overflow-hidden px-4 sm:max-w-md">{children}</div>
    </div>
  );
}
