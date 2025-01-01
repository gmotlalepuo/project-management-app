import { Head, useForm } from "@inertiajs/react";
import AuthFlowLayout from "@/Layouts/AuthFlowLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { FormEventHandler } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/Components/ui/accordion";
import PasswordStrengthMeter from "@/Components/PasswordStrengthMeter";
import React from "react";

export default function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: "",
  });

  const [isPasswordValid, setIsPasswordValid] = React.useState(false);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.confirm"), {
      onFinish: () => reset("password"),
    });
  };

  return (
    <AuthFlowLayout>
      <Head title="Confirm Password" />

      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        This is a secure area of the application. Please confirm your password before
        continuing.
      </div>

      <form
        onSubmit={submit}
        className="space-y-6 rounded-lg bg-white p-4 shadow dark:bg-card sm:p-8"
      >
        <div>
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

        <div className="flex justify-end">
          <Button type="submit" disabled={processing || !isPasswordValid}>
            Confirm
          </Button>
        </div>
      </form>
    </AuthFlowLayout>
  );
}
