import { useForm, usePage } from "@inertiajs/react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Alert, AlertTitle } from "@/Components/ui/alert";
import { AlertCircle, UsersRound } from "lucide-react";
import InputError from "@/Components/InputError";
import { User } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/types/project";
import { PageProps } from "@/types";
import _ from "lodash";

type Props = {
  project: Project;
  success: string | null;
  serverError: string | null;
};

export default function InviteUsers({ project, success, serverError }: Props) {
  const user = usePage<PageProps>().props.auth.user;
  const [isInviteFormVisible, setInviteFormVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(serverError);
  const { data, setData, post, reset, errors } = useForm({
    email: "",
    currentUserEmail: user.email,
  });

  const { toast } = useToast(); // Initialize the toast hook

  // Trigger the toast notification if there's a success message on load
  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        variant: "success",
        description: success,
      });
    }
  }, [success]);

  const toggleInviteForm = () => {
    setInviteFormVisible(!isInviteFormVisible);
    setSearchResults([]);
    setSelectedUser(null);
    setError(null); // Reset error state
    reset("email");
  };

  const searchUsers = async () => {
    if (!data.email) return;

    setSelectedUser(null); // Reset selected user

    try {
      const response = await fetch(
        route("user.search", { project: project.id }) + `?email=${data.email}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: "same-origin",
        },
      );

      if (!response.ok) {
        if (response.status === 422) {
          setError("Please enter a valid email address.");
        } else {
          const result = await response.json();
          throw new Error(
            result.error || "An error occurred while searching for users.",
          );
        }
      } else {
        const result = await response.json();
        setSearchResults(result.users);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message);
      setSearchResults([]);
    }
  };

  const debouncedSearch = useCallback(_.debounce(searchUsers, 1000), [
    data.email,
  ]);

  useEffect(() => {
    if (data.email) {
      debouncedSearch();
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [data.email, debouncedSearch]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchUsers();
    }
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setSearchResults([]);
    setError(null); // Reset error state
  };

  const submitInvite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedUser) return;

    post(route("project.invite", { project: project.id }), {
      onSuccess: () => {
        toggleInviteForm();
      },
      onError: (errors) => {
        setError(errors.email || "An error occurred while inviting the user.");
      },
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-card">
      <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
        Invite Users
      </h2>

      {!isInviteFormVisible ? (
        <Button className="mt-4" onClick={toggleInviteForm}>
          <UsersRound className="h-5 w-5" />
          Invite Users
        </Button>
      ) : (
        <form onSubmit={submitInvite} className="mt-4 space-y-4">
          <Input
            type="email"
            placeholder="Enter user's email, then press Enter"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            onKeyDown={onKeyDown}
            required
          />
          <InputError message={errors.email} />

          {error && ( // Display error message dynamically
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          {searchResults.length > 0 && (
            <ul className="mt-2 rounded border p-2">
              {searchResults.map((user: User) => (
                <li
                  key={user.id}
                  onClick={() => selectUser(user)}
                  className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          )}

          {selectedUser && (
            <div className="mt-4">
              <p className="font-semibold">
                Selected User: {selectedUser.name} ({selectedUser.email})
              </p>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Button type="submit" disabled={!selectedUser}>
              Invite
            </Button>
            <Button variant="secondary" onClick={toggleInviteForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
