import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { USER_STATUS_CLASS_MAP, USER_STATUS_TEXT_MAP } from "@/constants";
import TasksTable from "../Task/TasksTable";
import { User } from "@/types/user";
import { PaginatedTask } from "@/types/task";

type Props = {
  user: User;
  tasks: PaginatedTask;
  queryParams: { [key: string]: any };
};

export default function Show({ user, tasks, queryParams }: Props) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          {`User "${user.name}"`}
        </h2>
      }
    >
      <Head title={`User "${user.name}"`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <img
              src={user.image_path}
              alt=""
              className="d-block h-64 w-full object-cover"
            />

            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="mt-2 grid grid-cols-2 gap-1">
                <div>
                  <div>
                    <label className="text-lg font-bold">User ID</label>
                    <p className="mt-1">{user.id}</p>
                  </div>
                  <div className="mt-4">
                    <label className="text-lg font-bold">User Name</label>
                    <p className="mt-1">{user.name}</p>
                  </div>
                  <div className="mt-4">
                    <label className="text-lg font-bold">User Status</label>
                    <p className="mt-1">
                      <span
                        className={`rounded px-2 py-1 text-white ${USER_STATUS_CLASS_MAP[user.status]}`}
                      >
                        {USER_STATUS_TEXT_MAP[user.status]}
                      </span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="text-lg font-bold">Created By</label>
                    <p className="mt-1">{user.createdBy.name}</p>
                  </div>
                </div>
                <div>
                  <div>
                    <label className="text-lg font-bold">Due Date</label>
                    <p className="mt-1">{user.due_date}</p>
                  </div>
                  <div className="mt-4">
                    <label className="text-lg font-bold">Create Date</label>
                    <p className="mt-1">{user.created_at}</p>
                  </div>
                  <div className="mt-4">
                    <label className="text-lg font-bold">Updated By</label>
                    <p className="mt-1">{user.updatedBy.name}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-lg font-bold">Description</label>
                <p className="mt-1">{user.description}</p>
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
                All User Tasks
              </h2>
              <TasksTable
                tasks={tasks}
                queryParams={queryParams}
                hideUserColumn
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
