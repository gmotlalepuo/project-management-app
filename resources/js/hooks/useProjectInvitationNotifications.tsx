import { useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/Components/ui/button";
import { PageProps } from "@/types";
import { ProjectInvitationEvent } from "@/types/project";

export function useProjectInvitationNotifications() {
  const user = usePage<PageProps>().props.auth.user;
  const { toast, dismiss } = useToast();

  useEffect(() => {
    const channel = window.Echo.private(`management.${user.id}`);

    channel.listen(
      "ProjectInvitationRequestReceived",
      (event: ProjectInvitationEvent) => {
        const toaster = toast({
          title: "New Project Invitation",
          description: `You've been invited to join ${event.project.name}`,
          variant: "default",
          action: (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  router.post(
                    route("project.acceptInvitation", event.project.id),
                    {
                      preserveScroll: true,
                    },
                  );
                  dismiss(toaster.id);
                }}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  router.post(
                    route("project.rejectInvitation", event.project.id),
                    {
                      preserveScroll: true,
                    },
                  );
                  dismiss(toaster.id);
                }}
              >
                Reject
              </Button>
            </div>
          ),
        });
      },
    );

    return () => {
      channel.stopListening("ProjectInvitationRequestReceived");
    };
  }, [user.id]);
}
