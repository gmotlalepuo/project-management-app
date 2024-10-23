import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants";
import { PaginatedTask } from "@/types/task";
import { Link, router } from "@inertiajs/react";

type TasksTableProps = {
  tasks: PaginatedTask;
  success?: string | null;
  queryParams: { [key: string]: any } | null;
  hideProjectColumn?: boolean;
};

export default function TasksTable({
  tasks,
  success,
  queryParams = null,
  hideProjectColumn = false,
}: TasksTableProps) {
  queryParams = queryParams || {};

  const searchFieldChanged = (name: string, value: string) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }

    router.get(route("task.index"), queryParams, { preserveState: true });
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

    router.get(route("task.index"), queryParams, { preserveState: true });
  };

  const deleteTask = (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }
    router.delete(route("task.destroy", id));
  };

  return (
    <>
      {success && (
        <div className="mb-4 rounded bg-emerald-500 px-4 py-2 text-white">
          {success}
        </div>
      )}
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
              {!hideProjectColumn && (
                <th className="px-3 py-3">Project Name</th>
              )}
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
              {!hideProjectColumn && <th className="px-3 py-3"></th>}
              <th className="px-3 py-3">
                <TextInput
                  className="w-full"
                  defaultValue={queryParams.name}
                  placeholder="Task Name"
                  onBlur={(e) => searchFieldChanged("name", e.target.value)}
                  onKeyDown={(e) => onKeyDown("name", e)}
                />
              </th>
              <th className="px-3 py-3">
                <SelectInput
                  className="w-full"
                  defaultValue={queryParams.status}
                  onChange={(e) => searchFieldChanged("status", e.target.value)}
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
            {tasks.data.map((task) => (
              <tr
                className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                key={task.id}
              >
                <td className="px-3 py-2">{task.id}</td>
                <td className="px-3 py-2">
                  <img
                    src={task.image_path}
                    style={{ width: 100 }}
                    alt={task.name}
                  />
                </td>
                {!hideProjectColumn && (
                  <td className="px-3 py-2">{task.project.name}</td>
                )}
                <th className="px-3 py-2 text-gray-900 hover:underline dark:text-gray-100">
                  <Link href={route("task.show", task.id)}>{task.name}</Link>
                </th>
                <td className="px-3 py-2">
                  <span
                    className={`text-nowrap rounded px-2 py-1 text-white ${TASK_STATUS_CLASS_MAP[task.status]}`}
                  >
                    {TASK_STATUS_TEXT_MAP[task.status]}
                  </span>
                </td>
                <td className="text-nowrap px-3 py-2">{task.created_at}</td>
                <td className="text-nowrap px-3 py-2">{task.due_date}</td>
                <td className="px-3 py-2">{task.createdBy.name}</td>
                <td className="text-nowrap px-3 py-2">
                  <Link
                    href={route("task.edit", task.id)}
                    className="mx-1 font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteTask(task.id)}
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
      <Pagination links={tasks.meta.links} />
    </>
  );
}
