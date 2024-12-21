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
import { Label as TaskLabel } from "@/types/task";
import { TaskLabelBadgeVariant } from "@/utils/constants";

type Props = {
  project: Pick<Project, "id" | "name">;
  label: TaskLabel;
};

export default function Edit({ project, label }: Props) {
  const { data, setData, put, errors } = useForm({
    name: label.name,
    variant: label.variant,
  });

  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    put(
      route("project.labels.update", {
        project: project.id,
        label: label.id,
      }),
      {
        preserveState: true,
        onError: (error) => {
          const errorMessage = Object.values(error).join(" ");
          toast({
            title: "Failed to update label",
            variant: "destructive",
            description: errorMessage,
            duration: 5000,
          });
        },
      },
    );
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Edit Label - {project.name}
        </h2>
      }
    >
      <Head title={`Edit Label - ${project.name}`} />

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="space-y-6 bg-white p-4 shadow dark:bg-card sm:rounded-lg sm:p-8"
            >
              {/* Label Name */}
              <div className="space-y-2">
                <Label htmlFor="label_name">Label Name</Label>
                <Input
                  id="label_name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  required
                  autoFocus
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              {/* Label Style */}
              <div className="space-y-2">
                <Label htmlFor="label_variant">Label Style</Label>
                <Select
                  onValueChange={(value: TaskLabelBadgeVariant) =>
                    setData("variant", value)
                  }
                  defaultValue={data.variant}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="amber">Amber</SelectItem>
                    <SelectItem value="indigo">Indigo</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                    <SelectItem value="teal">Teal</SelectItem>
                    <SelectItem value="cyan">Cyan</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                  </SelectContent>
                </Select>
                <InputError message={errors.variant} className="mt-2" />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Link href={route("project.labels.index", project.id)}>
                  <Button variant="secondary">Cancel</Button>
                </Link>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
