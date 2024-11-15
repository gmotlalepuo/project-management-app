import { Head, Link, useForm } from "@inertiajs/react";
import AuthFlowLayout from "@/Layouts/AuthFlowLayout";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormEventHandler } from "react";

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});
  const { toast } = useToast();

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("verification.send"), {
      onSuccess: () => {
        toast({
          title: "Verification email sent",
          description: "A new verification link has been sent to your email.",
          duration: 5000,
        });
      },
    });
  };

  return (
    <AuthFlowLayout>
      <Head title="Email Verification" />

      <main className="rounded-lg bg-white p-4 shadow dark:bg-card sm:p-8">
        <div className="mb-4 text-sm">
          Thanks for signing up! Before getting started, could you verify your
          email address by clicking on the link we just emailed to you? If you
          didn't receive the email, we will gladly send you another.
        </div>

        {status === "verification-link-sent" && (
          <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
            A new verification link has been sent to the email address you
            provided during registration.
          </div>
        )}

        <form onSubmit={submit}>
          <div className="mt-4 flex items-center justify-between">
            <Button type="submit" disabled={processing}>
              Resend Verification Email
            </Button>

            <Link
              href={route("logout")}
              method="post"
              as="button"
              className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
            >
              Log Out
            </Link>
          </div>
        </form>
      </main>
    </AuthFlowLayout>
  );
}
