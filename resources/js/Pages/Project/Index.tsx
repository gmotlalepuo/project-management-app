import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import TableHeading from "@/Components/TableHeading";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { PaginatedProject } from "@/types/project";

type IndexProps = {
  projects: PaginatedProject;
  queryParams: { [key: string]: any } | null;
  success: string | null;
};

export default function Index({ projects, queryParams, success }: IndexProps) {
  queryParams = queryParams || {};
  const searchFieldChanged = (name: string, value: string) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }

    router.get(route("project.index"), queryParams, { preserveState: true });
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

    router.get(route("project.index"), queryParams, { preserveState: true });
  };

  const deleteProject = (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }
    router.delete(route("project.destroy", id));
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Projects
          </h2>
          <Link
            href={route("project.create")}
            className="rounded bg-emerald-500 px-3 py-1 text-white shadow transition-all hover:bg-emerald-600"
          >
            Create Project
          </Link>
        </div>
      }
    >
      <Head title="Projects" />

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
                      <th className="px-3 py-3">Image</th>
                      <TableHeading
                        name="name"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Name
                      </TableHeading>
                      <TableHeading
                        name="status"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Status
                      </TableHeading>
                      <TableHeading
                        name="created_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Create Date
                      </TableHeading>
                      <TableHeading
                        name="due_date"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Due Date
                      </TableHeading>
                      <th className="px-3 py-3">Created By</th>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <thead className="border-b-2 border-gray-500 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder="Project Name"
                          onBlur={(e) =>
                            searchFieldChanged("name", e.target.value)
                          }
                          onKeyDown={(e) => onKeyDown("name", e)}
                        />
                      </th>
                      <th className="px-3 py-3">
                        <SelectInput
                          className="w-full"
                          defaultValue={queryParams.status}
                          onChange={(e) =>
                            searchFieldChanged("status", e.target.value)
                          }
                        >
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </SelectInput>
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.data.map((project) => (
                      <tr
                        className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                        key={project.id}
                      >
                        <td className="px-3 py-2">{project.id}</td>
                        <td className="px-3 py-2">
                          <img
                            src={project.image_path}
                            style={{ width: 100 }}
                            alt={project.name}
                          />
                        </td>
                        <th className="text-nowrap px-3 py-2 text-white hover:underline">
                          <Link href={route("project.show", project.id)}>
                            {project.name}
                          </Link>
                        </th>
                        <td className="px-3 py-2">
                          <span
                            className={`rounded px-2 py-1 text-white ${PROJECT_STATUS_CLASS_MAP[project.status]}`}
                          >
                            {PROJECT_STATUS_TEXT_MAP[project.status]}
                          </span>
                        </td>
                        <td className="text-nowrap px-3 py-2">
                          {project.created_at}
                        </td>
                        <td className="text-nowrap px-3 py-2">
                          {project.due_date}
                        </td>
                        <td className="px-3 py-2">{project.createdBy.name}</td>
                        <td className="text-nowrap px-3 py-2">
                          <Link
                            href={route("project.edit", project.id)}
                            className="mx-1 font-medium text-blue-600 hover:underline dark:text-blue-500"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteProject(project.id)}
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
              <Pagination links={projects.meta.links} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
