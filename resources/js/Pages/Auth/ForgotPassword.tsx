import { Head, useForm } from "@inertiajs/react";
import AuthFlowLayout from "@/Layouts/AuthFlowLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { FormEventHandler } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Check, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";

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

      {status && (
        <Alert className="mb-4 shadow" variant="success">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription className="mb-1">{status}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-6">
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

            <Button type="submit" className="w-full" disabled={processing}>
              <Mail className="h-4 w-4" />
              Send Reset Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthFlowLayout>
  );
}
