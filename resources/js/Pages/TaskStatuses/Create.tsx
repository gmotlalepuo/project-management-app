import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import InputError from "@/Components/InputError";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/types/project";
import { TASK_STATUS_BADGE_VARIANTS } from "@/utils/constants";

type Props = {
  project: Pick<Project, "id" | "name">;
};

export default function Create({ project }: Props) {
  const { data, setData, post, errors, reset } = useForm({
    name: "",
    color: "",
    project_id: project.id,
  });

  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    post(route("project.statuses.store", project.id), {
      preserveState: true,
      onSuccess: () => reset(),
      onError: (error) => {
        const errorMessage = Object.values(error).join(" ");
        toast({
          title: "Failed to create status",
          variant: "destructive",
          description: errorMessage,
          duration: 5000,
        });
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Create New Status - {project.name}
        </h2>
      }
    >
      <Head title={`Create Status - ${project.name}`} />

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="space-y-6 bg-white p-4 shadow dark:bg-card sm:rounded-lg sm:p-8"
            >
              {/* Status Name */}
              <div className="space-y-2">
                <Label htmlFor="status_name">Status Name</Label>
                <Input
                  id="status_name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  required
                  autoFocus
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              {/* Status Color */}
              <div className="space-y-2">
                <Label htmlFor="status_color">Status Color</Label>
                <Select
                  onValueChange={(value) => setData("color", value)}
                  defaultValue={data.color}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Color" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TASK_STATUS_BADGE_VARIANTS).map(([key]) => (
                      <SelectItem key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.color} className="mt-2" />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Link href={route("project.statuses.index", project.id)}>
                  <Button variant="secondary">Cancel</Button>
                </Link>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
