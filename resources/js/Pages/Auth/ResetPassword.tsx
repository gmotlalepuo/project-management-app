import { Head, useForm } from "@inertiajs/react";
import AuthFlowLayout from "@/Layouts/AuthFlowLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { FormEventHandler } from "react";
import { KeyRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/Components/ui/accordion";
import PasswordStrengthMeter from "@/Components/PasswordStrengthMeter";
import React from "react";

export default function ResetPassword({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: "",
    password_confirmation: "",
  });

  const [isPasswordValid, setIsPasswordValid] = React.useState(false);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.store"), {
      onFinish: () => reset("password", "password_confirmation"),
    });
  };

  return (
    <AuthFlowLayout>
      <Head title="Reset Password" />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Create a new password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={data.email} disabled required />
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
              <Accordion
                type="single"
                value={data.password.length > 0 ? "password" : ""}
              >
                <AccordionItem value="password" className="border-none">
                  <AccordionContent className="pb-0">
                    <PasswordStrengthMeter
                      password={data.password}
                      onValidationChange={setIsPasswordValid}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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

            <Button
              type="submit"
              className="w-full"
              disabled={
                processing || !isPasswordValid || !data.password_confirmation
              }
            >
              <KeyRound className="h-4 w-4" />
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthFlowLayout>
  );
}
