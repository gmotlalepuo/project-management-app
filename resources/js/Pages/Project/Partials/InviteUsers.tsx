import { useForm, usePage } from "@inertiajs/react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Alert, AlertTitle } from "@/Components/ui/alert";
import { AlertCircle, Info, Search, UsersRound, X } from "lucide-react";
import InputError from "@/Components/InputError";
import { User } from "@/types/user";
import { Project } from "@/types/project";
import { PageProps } from "@/types";
import _ from "lodash";

type Props = {
  project: Project;
  serverError: string | null;
};

export default function InviteUsers({ project, serverError }: Props) {
  const user = usePage<PageProps>().props.auth.user;
  const [isInviteFormVisible, setInviteFormVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(serverError);
  const { data, setData, post, reset, errors } = useForm({
    email: "",
    currentUserEmail: user.email,
  });

  const toggleInviteForm = () => {
    setInviteFormVisible(!isInviteFormVisible);
    setSearchResults([]);
    setSelectedUser(null);
    setError(null); // Reset error state
    reset("email");
  };

  const searchUsers = async () => {
    if (!data.email) return;

    setSelectedUser(null);

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

      const result = await response.json();

      // Always clear previous results first
      setSearchResults([]);

      if (response.ok && result.users?.length > 0) {
        setSearchResults(result.users);
        setError(null);
        return;
      }

      // Set appropriate error message based on status code
      switch (response.status) {
        case 422:
          setError(result.error || "Please enter a valid email address.");
          break;
        case 409:
          setError(result.error || "User already invited.");
          break;
        case 404:
          setError(result.error || "No users found with this email.");
          break;
        default:
          setError(result.error || "An error occurred while searching.");
      }
    } catch (err) {
      setError("Failed to search for users.");
      setSearchResults([]);
    }
  };

  const debouncedSearch = useCallback(_.debounce(searchUsers, 500), [data.email]);

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
      <h2 className="mb-3 text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
        Invite Users
      </h2>

      <div className="rounded-lg border bg-secondary p-4 dark:bg-secondary/30">
        <div className="flex items-center gap-1.5">
          <Info className="h-4 w-4" />
          <h4 className="font-medium">About Inviting Users</h4>
        </div>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Enter a valid email address to search for a user to invite.</li>
          <li>
            After inviting, the invited user can either accept or reject the
            invitation.
          </li>
          <li>
            If the user rejects the invitation, you can invite the user again to the
            project.
          </li>
        </ul>
      </div>

      {!isInviteFormVisible ? (
        <Button className="mt-4" onClick={toggleInviteForm}>
          <Search className="h-5 w-5" />
          Search User
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
              <UsersRound className="h-4 w-4" />
              Invite
            </Button>
            <Button variant="secondary" onClick={toggleInviteForm}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
