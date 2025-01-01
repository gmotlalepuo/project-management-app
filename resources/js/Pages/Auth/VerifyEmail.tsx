import { Head, Link, useForm } from "@inertiajs/react";
import AuthFlowLayout from "@/Layouts/AuthFlowLayout";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormEventHandler } from "react";
import { Mail, LogOut } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});
  const { toast } = useToast();

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("verification.send"), {
      onSuccess: () => {
        toast({
          title: "Verification email sent",
          variant: "success",
          description: "A new verification link has been sent to your email.",
          duration: 5000,
        });
      },
    });
  };

  return (
    <AuthFlowLayout>
      <Head title="Email Verification" />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Email</CardTitle>
          <CardDescription>
            Thanks for signing up! Please verify your email address to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We've sent a verification link to your email address. If you haven't
            received the email, click below to request a new one.
          </p>

          {status === "verification-link-sent" && (
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              A new verification link has been sent to your email address.
            </p>
          )}

          <form onSubmit={submit}>
            <Button type="submit" className="w-full" disabled={processing}>
              <Mail className="h-4 w-4" />
              Resend Verification Email
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-4">
          <Link
            href={route("logout")}
            method="post"
            as="button"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Link>
        </CardFooter>
      </Card>
    </AuthFlowLayout>
  );
}
