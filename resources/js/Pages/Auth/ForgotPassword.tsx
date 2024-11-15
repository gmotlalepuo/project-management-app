import { Head, useForm } from "@inertiajs/react";
import AuthFlowLayout from "@/Layouts/AuthFlowLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { FormEventHandler } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Check, Info } from "lucide-react";

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.email"));
  };

  return (
    <AuthFlowLayout>
      <Head title="Forgot Password" />

      <div className="mb-4 rounded-lg bg-white p-4 text-sm text-accent-foreground shadow dark:bg-card sm:p-8">
        Forgot your password? No problem. Just let us know your email address
        and we will email you a password reset link that will allow you to
        choose a new one.
      </div>

      {status && (
        <Alert className="mb-4 shadow" variant="success">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription className="mb-1">{status}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={submit}
        className="mb-1 space-y-6 rounded-lg bg-white p-4 shadow dark:bg-card sm:p-8"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            required
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={processing}>
            Email Password Reset Link
          </Button>
        </div>
      </form>
    </AuthFlowLayout>
  );
}
