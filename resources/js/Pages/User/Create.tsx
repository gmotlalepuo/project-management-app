import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { useToast } from "@/hooks/use-toast";

type Props = {
  success?: string;
};

export default function Create({ success }: Props) {
  const { data, setData, post, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    post(route("user.store"), {
      preserveState: true,
      onSuccess: () => {
        reset();
      },
      onError: (error) => {
        const errorMessage = Object.values(error).join(" ");
        toast({
          title: "Failed to create user",
          variant: "destructive",
          description: errorMessage,
        });
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Create New User
        </h2>
      }
    >
      <Head title="Users" />

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="space-y-6 bg-white p-4 shadow dark:bg-card sm:rounded-lg sm:p-8"
            >
              {/* User Name */}
              <div className="space-y-2">
                <Label htmlFor="user_name">User Name</Label>
                <Input
                  id="user_name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  required
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              {/* User Email */}
              <div className="space-y-2">
                <Label htmlFor="user_email">User Email</Label>
                <Input
                  id="user_email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  required
                />
                <InputError message={errors.email} className="mt-2" />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="user_password">Password</Label>
                <Input
                  id="user_password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  required
                />
                <InputError message={errors.password} className="mt-2" />
              </div>

              {/* Password Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="user_password_confirmation">Confirm Password</Label>
                <Input
                  id="user_password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData("password_confirmation", e.target.value)}
                  required
                />
                <InputError
                  message={errors.password_confirmation}
                  className="mt-2"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Link href={route("user.index")}>
                  <Button variant="secondary">Cancel</Button>
                </Link>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
