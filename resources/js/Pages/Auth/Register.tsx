import { Head, Link, useForm } from "@inertiajs/react";
import AuthFlowLayout from "@/Layouts/AuthFlowLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { FormEventHandler } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { LogIn } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Separator } from "@/Components/ui/separator";

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation"),
    });
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      const response = await fetch(route("socialite.redirect", { provider }));
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Error during social login:", error);
    }
  };

  return (
    <AuthFlowLayout>
      <Head title="Register" />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                required
              />
              <InputError message={errors.name} className="mt-2" />
            </div>

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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                required
              />
              <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData("password_confirmation", e.target.value)}
                required
              />
              <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            <div className="space-y-3">
              <Button type="submit" className="flex w-full" disabled={processing}>
                <LogIn />
                <span>Sign up</span>
              </Button>
              <Link
                href={route("login")}
                className="inline-block text-sm text-muted-foreground underline"
              >
                Already registered?
              </Link>

              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-sm uppercase tracking-widest text-muted-foreground">
                  or
                </span>
                <Separator className="flex-1" />
              </div>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => handleSocialLogin("google")}
              >
                <FaGoogle />
                <span>Sign in with Google</span>
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => handleSocialLogin("github")}
              >
                <FaGithub />
                <span>Sign in with Github</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthFlowLayout>
  );
}
