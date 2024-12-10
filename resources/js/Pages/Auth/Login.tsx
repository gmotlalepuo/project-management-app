import { Head, Link, useForm } from "@inertiajs/react";
import AuthFlowLayout from "@/Layouts/AuthFlowLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Checkbox } from "@/Components/ui/checkbox";
import { FormEventHandler } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Check, LogIn } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const isMobile = useIsMobile();
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("login"), {
      onFinish: () => reset("password"),
    });
  };

  return (
    <AuthFlowLayout>
      <Head title="Log in" />
      {status && (
        <Alert className="mb-4 shadow" variant="success">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription className="mb-1">{status}</AlertDescription>
        </Alert>
      )}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {canResetPassword && !isMobile && (
                  <Link
                    href={route("password.request")}
                    className="ml-auto inline-block text-sm text-muted-foreground underline"
                  >
                    Forgot your password?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                required
              />
              <InputError message={errors.password} className="mt-2" />
              {canResetPassword && isMobile && (
                <Link
                  href={route("password.request")}
                  className="inline-block text-sm text-muted-foreground underline"
                >
                  Forgot your password?
                </Link>
              )}
            </div>

            <div>
              <label className="flex items-center">
                <Checkbox
                  name="remember"
                  checked={data.remember}
                  onCheckedChange={(checked) =>
                    setData("remember", checked === true)
                  }
                />
                <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </span>
              </label>
            </div>

            <div className="space-y-3">
              <Button type="submit" className="flex w-full" disabled={processing}>
                <LogIn />
                <span>Login</span>
              </Button>
              <Button variant="outline" className="w-full">
                <FaGoogle />
                <span>Sign in with Google</span>
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-center gap-2 text-sm">
          <span>Don&apos;t have an account?</span>
          <Link href={route("register")} className="underline">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </AuthFlowLayout>
  );
}
