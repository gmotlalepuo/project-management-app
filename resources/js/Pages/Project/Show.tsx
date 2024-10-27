import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
  PROJECT_STATUS_CLASS_MAP,
  PROJECT_STATUS_TEXT_MAP,
} from "@/utils/constants";
import TasksTable from "../Task/TasksTable";
import { Project } from "@/types/project";
import { PaginatedTask } from "@/types/task";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { User } from "@/types/user";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PageProps } from "@/types";

type Props = {
  project: Project;
  tasks: PaginatedTask;
  success: string | null;
  queryParams: { [key: string]: any };
};

export default function Show({ project, tasks, success, queryParams }: Props) {
  const user = usePage<PageProps>().props.auth.user;

  const [isInviteFormVisible, setInviteFormVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [noUsersFound, setNoUsersFound] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { data, setData, post, reset, errors } = useForm({
    email: "",
    currentUserEmail: user.email,
  });

  const toggleInviteForm = () => {
    setInviteFormVisible(!isInviteFormVisible);
    setSearchResults([]);
    setNoUsersFound(false);
    setSelectedUser(null);
    reset("email");
  };

  const searchUsers = async () => {
    if (!data.email) return;

    // Reset selected user whenever a new search is performed
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

      // Filter out the logged-in user and existing participants
      const filteredUsers = result.users.filter((user: User) => {
        return (
          user.email !== data.currentUserEmail &&
          !project.invitedUsers.some(
            (invitedUser: User) => invitedUser.email === user.email,
          ) &&
          project.createdBy.email !== user.email
        );
      });

      if (filteredUsers.length > 0) {
        setSearchResults(filteredUsers);
        setNoUsersFound(false);
      } else {
        setSearchResults([]);
        setNoUsersFound(true);
      }
    } catch (error) {
      console.error("Error searching users", error);
      setNoUsersFound(true);
    }
  };

  // Handle Enter key for searching users
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchUsers();
    }
  };

  const selectUser = (user: any) => {
    setSelectedUser(user);
    setSearchResults([]);
    setNoUsersFound(false);
  };

  const submitInvite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedUser) return;

    // Submit the selected user's email
    post(route("project.invite", { project: project.id }), {
      onSuccess: () => {
        toggleInviteForm();
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          {`Project "${project.name}"`}
        </h2>
      }
    >
      <Head title={`Project "${project.name}"`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            {project.image_path && (
              <img
                src={project.image_path}
                alt="Project Image"
                className="d-block mb-2 h-64 w-full object-cover"
              />
            )}

            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <div>
                    <label className="text-lg font-bold">Project ID</label>
                    <p className="mt-1">{project.id}</p>
                  </div>
                  <div className="mt-4">
                    <label className="text-lg font-bold">Project Name</label>
                    <p className="mt-1">{project.name}</p>
                  </div>
                  <div className="mt-4">
                    <label className="text-lg font-bold">Project Status</label>
                    <p className="mt-1">
                      <span
                        className={`rounded px-2 py-1 text-white ${PROJECT_STATUS_CLASS_MAP[project.status]}`}
                      >
                        {PROJECT_STATUS_TEXT_MAP[project.status]}
                      </span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="text-lg font-bold">Created By</label>
                    <p className="mt-1">{project.createdBy.name}</p>
                  </div>
                </div>
                <div>
                  <div>
                    <label className="text-lg font-bold">Due Date</label>
                    <p className="mt-1">{project.due_date}</p>
                  </div>
                  <div className="mt-4">
                    <label className="text-lg font-bold">Create Date</label>
                    <p className="mt-1">{project.created_at}</p>
                  </div>
                  <div className="mt-4">
                    <label className="text-lg font-bold">Updated By</label>
                    <p className="mt-1">{project.updatedBy.name}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-lg font-bold">Description</label>
                <p className="mt-1">{project.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <h2 className="mb-2 text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                Invite other users to this project
              </h2>

              {!isInviteFormVisible && (
                <Button onClick={toggleInviteForm}>Invite Users</Button>
              )}

              {isInviteFormVisible && (
                <form onSubmit={submitInvite}>
                  <div className="mb-4">
                    <TextInput
                      type="email"
                      className="w-full rounded border p-2 text-gray-900"
                      placeholder="Enter user's email"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                      onKeyDown={onKeyDown} // Trigger search on Enter key
                      required
                    />
                    <InputError message={errors.email} className="mt-2" />
                  </div>

                  {noUsersFound && (
                    <Alert className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No users found with this email</AlertTitle>
                    </Alert>
                  )}

                  {searchResults.length > 0 && (
                    <ul className="mb-4 rounded border p-2">
                      {searchResults.map((user: User) => (
                        <li
                          key={user.id}
                          className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                          onClick={() => selectUser(user)}
                        >
                          {user.name} ({user.email})
                        </li>
                      ))}
                    </ul>
                  )}

                  {selectedUser && (
                    <div className="mb-4">
                      <p className="font-semibold">
                        Selected User: {selectedUser.name} ({selectedUser.email}
                        )
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" disabled={!selectedUser}>
                      Invite
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={toggleInviteForm}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pb-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <h2 className="mb-2 text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                All Project Tasks
              </h2>
              <TasksTable
                tasks={tasks}
                success={success}
                queryParams={queryParams}
                hideProjectColumn
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
