import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import TableHeading from "@/Components/TableHeading";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { PaginatedUser } from "@/types/user";

type IndexProps = {
  users: PaginatedUser;
  queryParams: { [key: string]: any } | null;
  success: string | null;
};

export default function Index({ users, queryParams, success }: IndexProps) {
  queryParams = queryParams || {};
  const searchFieldChanged = (name: string, value: string) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }

    router.get(route("user.index"), queryParams, { preserveState: true });
  };

  const onKeyDown = (
    name: string,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key !== "Enter") return;

    searchFieldChanged(name, e.currentTarget.value);
  };

  const sortChanged = (name: string) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === "asc") {
        queryParams.sort_direction = "desc";
      } else {
        queryParams.sort_direction = "asc";
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = "asc";
    }

    router.get(route("user.index"), queryParams, { preserveState: true });
  };

  const deleteUser = (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }
    router.delete(route("user.destroy", id));
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Users
          </h2>
          <Link
            href={route("user.create")}
            className="rounded bg-emerald-500 px-3 py-1 text-white shadow transition-all hover:bg-emerald-600"
          >
            Create User
          </Link>
        </div>
      }
    >
      <Head title="Users" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {success && (
            <div className="mb-4 rounded bg-emerald-500 px-4 py-2 text-white">
              {success}
            </div>
          )}

          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
                  <thead className="border-b-2 border-gray-500 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <TableHeading
                        name="id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        ID
                      </TableHeading>
                      <TableHeading
                        name="name"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Name
                      </TableHeading>
                      <TableHeading
                        name="email"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Email
                      </TableHeading>
                      <TableHeading
                        name="created_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Create Date
                      </TableHeading>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <thead className="border-b-2 border-gray-500 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder="User Name"
                          onBlur={(e) =>
                            searchFieldChanged("name", e.target.value)
                          }
                          onKeyDown={(e) => onKeyDown("name", e)}
                        />
                      </th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.email}
                          placeholder="User Email"
                          onBlur={(e) =>
                            searchFieldChanged("email", e.target.value)
                          }
                          onKeyDown={(e) => onKeyDown("email", e)}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.data.map((user) => (
                      <tr
                        className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                        key={user.id}
                      >
                        <td className="px-3 py-2">{user.id}</td>
                        <th className="text-nowrap px-3 py-2 text-white">
                          {user.name}
                        </th>
                        <td className="px-3 py-2">{user.email}</td>
                        <td className="text-nowrap px-3 py-2">
                          {user.created_at}
                        </td>
                        <td className="text-nowrap px-3 py-2">
                          <Link
                            href={route("user.edit", user.id)}
                            className="mx-1 font-medium text-blue-600 hover:underline dark:text-blue-500"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="mx-1 font-medium text-red-600 hover:underline dark:text-red-500"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination links={users.meta.links} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
