import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Project } from "@/types/project";
import { Badge } from "@/Components/ui/badge";
import {
  INVITATION_STATUS_BADGE_MAP,
  INVITATION_STATUS_TEXT_MAP,
} from "@/utils/constants";

type PageProps = {
  invitations: Project[];
};

export default function Invite({ invitations }: PageProps) {
  const handleAccept = (id: number) => {
    // Logic to accept the invitation
  };

  const handleReject = (id: number) => {
    // Logic to reject the invitation
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Projects
          </h2>
        </div>
      }
    >
      <Head title="Invitations" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <h2 className="mb-2 text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                Project Invitations
              </h2>

              {invitations.length > 0 ? (
                <div className="overflow-auto">
                  <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
                    <thead className="border-b-2 border-gray-500 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                      <tr className="text-nowrap">
                        <th className="px-3 py-3">Project Name</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-3 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitations.map((invitation: Project) => (
                        <tr
                          className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                          key={invitation.id}
                        >
                          <td className="px-3 py-2">{invitation.name}</td>
                          <td className="px-3 py-2">
                            <Badge
                              variant={
                                INVITATION_STATUS_BADGE_MAP[
                                  invitation.pivot
                                    ?.status as keyof typeof INVITATION_STATUS_BADGE_MAP
                                ]
                              }
                            >
                              {
                                INVITATION_STATUS_TEXT_MAP[
                                  invitation.pivot
                                    ?.status as keyof typeof INVITATION_STATUS_TEXT_MAP
                                ]
                              }
                            </Badge>
                          </td>
                          <td className="px-3 py-2">
                            {invitation.pivot?.status === "pending" && (
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => handleAccept(invitation.id)}
                                  size="sm"
                                >
                                  Accept
                                </Button>
                                <Button
                                  onClick={() => handleReject(invitation.id)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No invitations found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
