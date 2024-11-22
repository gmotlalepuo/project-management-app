import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

type Props = {
  mustVerifyEmail: boolean;
  status?: string;
  success?: string;
};

export default function Edit({ mustVerifyEmail, status, success }: Props) {
  const { toast } = useToast();

  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        variant: "success",
        description: success,
      });
    }
  }, [success]);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Profile
        </h2>
      }
    >
      <Head title="Profile" />

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-3 space-y-6 sm:px-6 lg:px-8">
          {/* Update Profile Information */}
          <div className="bg-white p-4 shadow dark:bg-card sm:rounded-lg sm:p-8">
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              className="max-w-xl"
            />
          </div>

          {/* Update Password */}
          <div className="bg-white p-4 shadow dark:bg-card sm:rounded-lg sm:p-8">
            <UpdatePasswordForm className="max-w-xl" />
          </div>

          {/* Delete User Account */}
          <div className="bg-white p-4 shadow dark:bg-card sm:rounded-lg sm:p-8">
            <DeleteUserForm className="max-w-xl" />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
