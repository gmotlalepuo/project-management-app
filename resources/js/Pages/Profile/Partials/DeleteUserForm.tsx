import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";
import { Button } from "@/Components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function DeleteUserForm({ className = "" }: { className?: string }) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
    clearErrors,
  } = useForm({
    password: "",
  });

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const deleteUser: FormEventHandler = (e) => {
    e.preventDefault();

    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
      },
      onError: () => {
        passwordInput.current?.focus();
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to delete your account. Please try again.",
        });
      },
      onFinish: () => {
        reset();
      },
    });
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);

    clearErrors();
    reset();
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Delete Account
        </h2>

        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Once your account is deleted, all of its resources and data will be
          permanently deleted. Before deleting your account, please download any data
          or information that you wish to retain.
        </p>
      </header>

      <Button variant="destructive" onClick={confirmUserDeletion}>
        Delete Account
      </Button>

      <AlertDialog
        open={confirmingUserDeletion}
        onOpenChange={setConfirmingUserDeletion}
      >
        <AlertDialogContent>
          <AlertDialogTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Are you sure you want to delete your account?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Once your account is deleted, all of its resources and data will be
            permanently deleted. Please enter your password to confirm you would like
            to permanently delete your account.
          </AlertDialogDescription>
          <form onSubmit={deleteUser}>
            <Label htmlFor="password_delete">Password</Label>
            <Input
              id="password_delete"
              type="password"
              name="password"
              ref={passwordInput}
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className="mt-1 block w-full"
              placeholder="Password"
            />

            <InputError message={errors.password} className="mt-2" />

            <AlertDialogFooter className="mt-6 flex justify-end">
              <AlertDialogCancel onClick={closeModal}>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="destructive"
                  disabled={processing}
                  onClick={deleteUser}
                >
                  Delete Account
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
