import { Link, useForm, usePage } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { PageProps } from "@/types";
import { useRef } from "react";

export default function UpdateProfileInformationForm({
  mustVerifyEmail,
  status,
  className = "",
}: {
  mustVerifyEmail: boolean;
  status?: string;
  className?: string;
}) {
  const user = usePage<PageProps>().props.auth.user;
  const { data, setData, post, errors, processing, reset } = useForm({
    name: user.name,
    email: user.email,
    profile_picture: null as File | null,
    _method: "PATCH",
  });
  const profilePictureInput = useRef<HTMLInputElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route("profile.update"), {
      preserveState: true,
      onSuccess: () => reset(),
    });
  };

  return (
    <section className={className}>
      <header className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Profile Information
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update your account's profile information and email address.
          </p>
        </div>
      </header>

      <form
        onSubmit={submit}
        className="mt-6 space-y-6"
        encType="multipart/form-data"
      >
        <div>
          <Label htmlFor="profile_picture">Profile Picture</Label>
          <Avatar className="my-2 h-16 w-16">
            <AvatarImage
              src={`/storage/${user.profile_picture}`}
              alt={user.name}
            />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Input
            id="profile_picture"
            type="file"
            ref={profilePictureInput}
            accept=".jpg,.jpeg,.png,.webp"
            onChange={(e) => {
              if (e.target.files && e.target.files[0])
                setData("profile_picture", e.target.files[0]);
            }}
            className="mt-1 block w-full"
          />
          <InputError message={errors.profile_picture} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.name} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            required
            className="mt-1 block w-full"
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        {mustVerifyEmail && user.email_verified_at === null && (
          <div>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              Your email address is unverified.
              <Link
                href={route("verification.send")}
                method="post"
                className="underline"
              >
                Resend Verification Email
              </Link>
            </p>
            {status === "verification-link-sent" && (
              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                A new verification link has been sent to your email address.
              </div>
            )}
          </div>
        )}
        <Button type="submit" disabled={processing}>
          Save Changes
        </Button>
      </form>
    </section>
  );
}
