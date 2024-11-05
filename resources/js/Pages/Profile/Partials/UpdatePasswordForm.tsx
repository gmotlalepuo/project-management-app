import { useForm } from "@inertiajs/react";
import { useRef } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";

export default function UpdatePasswordForm({
  className = "",
}: {
  className?: string;
}) {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);
  const { data, setData, put, errors, processing, reset } = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const updatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset("password", "password_confirmation");
          passwordInput.current?.focus();
        }
        if (errors.current_password) {
          reset("current_password");
          currentPasswordInput.current?.focus();
        }
      },
    });
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Update Password
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Ensure your account is using a secure, random password.
        </p>
      </header>

      <form onSubmit={updatePassword} className="mt-6 space-y-6">
        <div>
          <Label htmlFor="current_password">Current Password</Label>
          <Input
            id="current_password"
            type="password"
            value={data.current_password}
            onChange={(e) => setData("current_password", e.target.value)}
            ref={currentPasswordInput}
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.current_password} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
            ref={passwordInput}
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="password_confirmation">Confirm New Password</Label>
          <Input
            id="password_confirmation"
            type="password"
            value={data.password_confirmation}
            onChange={(e) => setData("password_confirmation", e.target.value)}
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <Button type="submit" disabled={processing}>
          Save Changes
        </Button>
      </form>
    </section>
  );
}
