import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

type Project = {
  projects: object[];
  data: Array<{
    id: number;
    name: string;
    description: string;
    created_at: string;
    due_date: string;
    status: string;
    image_path: string;
    createdBy: Object;
    updatedBy: Object;
  }>;
};

export default function Index({ projects }: { projects: Project }) {
  const user = usePage().props.auth.user;

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Projects
        </h2>
      }
    >
      <Head title="Projects" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="border-b-2 border-gray-500 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr className="text-nowrap">
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Image</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Create Date</th>
                    <th className="px-3 py-2">Due Date</th>
                    <th className="px-3 py-2">Created By</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.data.map((project) => (
                    <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                      <td className="px-3 py-2">{project.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
