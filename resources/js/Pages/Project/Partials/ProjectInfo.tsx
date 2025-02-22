import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { formatDate } from "@/utils/helpers";
import { Project } from "@/types/project";
import {
  PROJECT_STATUS_BADGE_MAP,
  PROJECT_STATUS_TEXT_MAP,
  ROLE_TEXT_MAP,
} from "@/utils/constants";
import { Button } from "@/Components/ui/button";
import {
  CircleX,
  LogOut,
  Pencil,
  UsersRound,
  UserMinus,
  Tag,
  UserCog,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Checkbox } from "@/Components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

type Props = {
  project: Project;
  onInviteClick: () => void;
  permissions: {
    canInviteUsers: boolean;
    canEditProject: boolean;
  };
};

export default function ProjectInfo({ project, onInviteClick, permissions }: Props) {
  const authUser = usePage<PageProps>().props.auth.user;
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isKickDialogOpen, setKickDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isManageUsersDialogOpen, setManageUsersDialogOpen] = useState(false);
  const [roleChangeConfirmation, setRoleChangeConfirmation] = useState<{
    isOpen: boolean;
    userId: number | null;
    newRole: string | null;
    userName: string;
  }>({
    isOpen: false,
    userId: null,
    newRole: null,
    userName: "",
  });

  const kickableUsers = project.acceptedUsers?.filter(
    (user) =>
      user.id !== authUser.id && // Filter out current user
      ((user.pivot?.role === "project_member" && permissions.canInviteUsers) ||
        (user.pivot?.role === "project_manager" &&
          project.createdBy.id === authUser.id)),
  );

  const manageableUsers = project.acceptedUsers?.filter(
    (user) =>
      // Filter out project creator and current user
      user.id !== project.createdBy.id && user.id !== authUser.id,
  );

  const handleLeaveProject = () => {
    router.post(route("project.leave", { project: project.id }), {
      preserveScroll: true,
    });
  };

  const handleDeleteProject = () => {
    router.delete(route("project.destroy", { project: project.id }), {
      preserveScroll: true,
    });
  };

  const handleKickMembers = () => {
    router.post(
      route("project.kick-members", { project: project.id }),
      { user_ids: selectedUsers },
      {
        preserveScroll: true,
        onSuccess: () => {
          setKickDialogOpen(false);
          setSelectedUsers([]);
        },
      },
    );
  };

  const handleRoleChange = (userId: number, newRole: string, userName: string) => {
    setRoleChangeConfirmation({
      isOpen: true,
      userId,
      newRole,
      userName,
    });
  };

  const executeRoleChange = () => {
    if (roleChangeConfirmation.userId && roleChangeConfirmation.newRole) {
      router.put(
        route("project.update-user-role", { project: project.id }),
        {
          user_id: roleChangeConfirmation.userId,
          role: roleChangeConfirmation.newRole,
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            setManageUsersDialogOpen(false);
            setRoleChangeConfirmation({
              isOpen: false,
              userId: null,
              newRole: null,
              userName: "",
            });
          },
        },
      );
    }
  };

  return (
    <div className="space-y-6 rounded-lg">
      {/* Project Image Card - Add this new card at the top */}
      {project.image_path && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Project Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg">
              <img
                src={project.image_path}
                alt={project.name}
                className="w-full object-cover"
                style={{ maxHeight: "300px" }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Project Information Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Project ID</Label>
              <p className="text-gray-700 dark:text-gray-300">{project.id}</p>
            </div>
            <div>
              <Label>Project Name</Label>
              <p className="text-gray-700 dark:text-gray-300">{project.name}</p>
            </div>
            <div className="flex flex-col items-baseline space-y-3">
              <Label>Project Status</Label>
              <Badge variant={PROJECT_STATUS_BADGE_MAP(project.status)}>
                {PROJECT_STATUS_TEXT_MAP[project.status]}
              </Badge>
            </div>
            <div>
              <Label>Created By</Label>
              <p className="text-gray-700 dark:text-gray-300">
                {project.createdBy.name} ({project.createdBy.email})
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Date & Update Info Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Project Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Due Date</Label>
              <p className="text-gray-700 dark:text-gray-300">
                {project.due_date ? formatDate(project.due_date) : "No date"}
              </p>
            </div>
            <div>
              <Label>Created At</Label>
              <p className="text-gray-700 dark:text-gray-300">
                {formatDate(project.created_at)}
              </p>
            </div>
            <div>
              <Label>Updated By</Label>
              <p className="text-gray-700 dark:text-gray-300">
                {project.updatedBy.name} ({project.updatedBy.email})
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Project Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
        </CardContent>
      </Card>

      {/* Project Members Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Project Members</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {/* Display the creator of the project */}
          <div key={project.createdBy.id} className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage
                src={project.createdBy.profile_picture}
                alt={project.createdBy.name}
              />
              <AvatarFallback>{project.createdBy.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                {project.createdBy.name} ({project.createdBy.email})
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Creator</Badge>
                {project.acceptedUsers?.some(
                  (user) =>
                    user.id === project.createdBy.id &&
                    user.pivot?.role === "project_manager",
                ) && <Badge variant="outline">PM</Badge>}
              </div>
            </div>
          </div>

          {/* Display accepted users (excluding creator) */}
          {project.acceptedUsers
            ?.filter((user) => user.id !== project.createdBy.id)
            .map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                <Avatar>
                  {user.profile_picture ? (
                    <AvatarImage
                      src={`/storage/${user.profile_picture}`}
                      alt={user.name}
                    />
                  ) : (
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {user.name} ({user.email})
                  </p>
                  <Badge variant="outline">
                    {user.pivot?.role === "project_manager" ? "PM" : "Member"}
                  </Badge>
                </div>
              </div>
            ))}

          {permissions.canInviteUsers && (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              {/* Invite Users Button - Only show if permitted */}
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={onInviteClick}
              >
                <UsersRound className="h-5 w-5" />
                Invite Users
              </Button>
              {/* Kick Members Button - Only show if permitted */}
              {permissions.canInviteUsers && kickableUsers?.length > 0 && (
                <Dialog open={isKickDialogOpen} onOpenChange={setKickDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto">
                      <UserMinus className="h-5 w-5" />
                      Kick Members
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select Members to Remove</DialogTitle>
                      <DialogDescription>
                        By kicking users, you will also unassign them from any tasks
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {kickableUsers && kickableUsers.length > 0 ? (
                        <>
                          {kickableUsers.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`user-${user.id}`}
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedUsers([...selectedUsers, user.id]);
                                  } else {
                                    setSelectedUsers(
                                      selectedUsers.filter((id) => id !== user.id),
                                    );
                                  }
                                }}
                              />
                              <label htmlFor={`user-${user.id}`}>
                                {user.name} (
                                {
                                  ROLE_TEXT_MAP[
                                    user.pivot?.role as keyof typeof ROLE_TEXT_MAP
                                  ]
                                }
                                )
                              </label>
                            </div>
                          ))}
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setKickDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              disabled={selectedUsers.length === 0}
                              onClick={handleKickMembers}
                            >
                              Kick Selected Members
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          No members available to kick at this time.
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {/* Manage Users Button - Only show if permitted */}
              {manageableUsers && manageableUsers.length > 0 && (
                <Dialog
                  open={isManageUsersDialogOpen}
                  onOpenChange={setManageUsersDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto">
                      <UserCog className="h-5 w-5" />
                      Manage Users
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Manage User Roles</DialogTitle>
                      <DialogDescription>
                        Project managers can promote members to project managers.
                        Only the project creator can demote project managers to
                        members.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {project.acceptedUsers
                        ?.filter(
                          (user) =>
                            // Filter out project creator and current user
                            user.id !== project.createdBy.id &&
                            user.id !== authUser.id,
                        )
                        .map((user) => (
                          <div
                            key={user.id}
                            className="flex flex-col justify-between gap-2 space-x-2 rounded-lg border p-3 sm:flex-row sm:items-center"
                          >
                            <div className="flex items-center space-x-2">
                              <Avatar>
                                {user.profile_picture ? (
                                  <AvatarImage
                                    src={`/storage/${user.profile_picture}`}
                                    alt={user.name}
                                  />
                                ) : (
                                  <AvatarFallback>
                                    {user.name.charAt(0)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <Select
                              value={user.pivot?.role}
                              onValueChange={(value) =>
                                handleRoleChange(user.id, value, user.name)
                              }
                              disabled={
                                // Disable if:
                                // 1. No permission to manage users
                                // 2. Trying to demote a project manager while not being the creator
                                !permissions.canInviteUsers ||
                                (user.pivot?.role === "project_manager" &&
                                  project.createdBy.id !== authUser.id)
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="project_manager">
                                  Project Manager
                                </SelectItem>
                                <SelectItem value="project_member">
                                  Project Member
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Actions Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Project Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            {permissions.canEditProject && (
              <>
                <Link href={route("project.edit", project.id)}>
                  <Button className="w-full" variant="outline">
                    <Pencil className="h-5 w-5" />
                    <span>Edit Project</span>
                  </Button>
                </Link>
                <Link href={route("project.labels.index", project.id)}>
                  <Button className="w-full" variant="outline">
                    <Tag className="h-5 w-5" />
                    <span>Manage Task Labels</span>
                  </Button>
                </Link>
                <Link href={route("project.statuses.index", project.id)}>
                  <Button className="w-full" variant="outline">
                    <Settings className="h-5 w-5" />
                    <span>Manage Task Statuses</span>
                  </Button>
                </Link>
              </>
            )}
            <Link href={route("kanban.show", project.id)}>
              <Button className="w-full" variant="outline">
                <LayoutDashboard className="h-5 w-5" />
                <span>Kanban Board</span>
              </Button>
            </Link>

            <Button variant="destructive" onClick={() => setDialogOpen(true)}>
              {project.createdBy.id === authUser.id ? (
                <CircleX className="h-5 w-5" />
              ) : (
                <LogOut className="h-5 w-5" />
              )}
              {project.createdBy.id === authUser.id
                ? "Delete Project"
                : "Leave Project"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>
            {project.createdBy.id === authUser.id
              ? "Confirm Project Deletion"
              : "Confirm Leaving Project"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {project.createdBy.id === authUser.id
              ? "Are you sure you want to delete this project? This action cannot be undone."
              : "Are you sure you want to leave this project?"}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                project.createdBy.id === authUser.id
                  ? handleDeleteProject()
                  : handleLeaveProject();
                setDialogOpen(false);
              }}
            >
              {project.createdBy.id === authUser.id ? "Delete" : "Leave"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Role Change Confirmation Dialog */}
      <AlertDialog
        open={roleChangeConfirmation.isOpen}
        onOpenChange={(isOpen) =>
          setRoleChangeConfirmation((prev) => ({ ...prev, isOpen }))
        }
      >
        <AlertDialogContent>
          <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to change {roleChangeConfirmation.userName}'s role
            to{" "}
            {roleChangeConfirmation.newRole === "project_manager"
              ? "Project Manager"
              : "Project Member"}
            ?
          </AlertDialogDescription>
          {roleChangeConfirmation.newRole === "project_manager" && (
            <div className="mt-2 rounded-lg border border-yellow-500 bg-yellow-50 p-3 text-yellow-800 dark:border-yellow-400/30 dark:bg-yellow-900/30 dark:text-yellow-200">
              <span>
                <strong>Warning:</strong> Project Managers can:
              </span>
              <ul className="ml-4 list-disc">
                <li>Manage tasks and labels</li>
                <li>Invite new members</li>
                <li>Promote other members to Project Managers</li>
                <li>Access sensitive project settings</li>
              </ul>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setRoleChangeConfirmation({
                  isOpen: false,
                  userId: null,
                  newRole: null,
                  userName: "",
                })
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={executeRoleChange}>
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
