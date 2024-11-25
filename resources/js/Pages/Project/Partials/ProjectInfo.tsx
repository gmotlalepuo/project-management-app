import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { formatDate } from "@/utils/helpers";
import { Project } from "@/types/project";
import {
  PROJECT_STATUS_BADGE_MAP,
  PROJECT_STATUS_TEXT_MAP,
} from "@/utils/constants";
import { Button } from "@/Components/ui/button";
import { UsersRound } from "lucide-react";
import { router, usePage } from "@inertiajs/react";
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

type Props = {
  project: Project;
  onInviteClick: () => void;
};

export default function ProjectInfo({ project, onInviteClick }: Props) {
  const authUser = usePage<PageProps>().props.auth.user;
  const [isDialogOpen, setDialogOpen] = useState(false);

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

  return (
    <div className="= space-y-6 rounded-lg">
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
              <Badge variant={PROJECT_STATUS_BADGE_MAP[project.status]}>
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
            <CardTitle className="text-lg font-semibold">
              Project Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Due Date</Label>
              <p className="text-gray-700 dark:text-gray-300">
                {formatDate(project.due_date)}
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
          <p className="text-gray-700 dark:text-gray-300">
            {project.description}
          </p>
        </CardContent>
      </Card>

      {/* Project Members Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Project Members
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {/* Display the creator of the project */}
          <div
            key={project.createdBy.id}
            className="flex items-center space-x-2"
          >
            <Avatar>
              <AvatarImage
                src={project.createdBy.profile_picture}
                alt={project.createdBy.name}
              />
              <AvatarFallback>
                {project.createdBy.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="text-gray-700 dark:text-gray-300">
              {project.createdBy.name} ({project.createdBy.email})
              <Badge variant="outline" className="ml-2">
                Creator
              </Badge>
            </p>
          </div>
          {/* Display the accepted users */}
          {project.acceptedUsers?.map((user) => (
            <div key={user.id} className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={user.profile_picture} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="text-gray-700 dark:text-gray-300">
                {user.name} ({user.email})
              </p>
            </div>
          ))}

          {/* Invite Users Button */}
          <div className="w-full">
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={onInviteClick}
            >
              <UsersRound className="h-5 w-5" />
              Invite Users
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Project Actions Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Project Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setDialogOpen(true)}>
            {project.createdBy.id === authUser.id
              ? "Delete Project"
              : "Leave Project"}
          </Button>
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
    </div>
  );
}
