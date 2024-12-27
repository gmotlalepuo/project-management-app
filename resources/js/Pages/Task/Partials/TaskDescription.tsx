import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Task } from "@/types/task";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";

type TaskDescriptionProps = {
  task: Task;
};

export function TaskDescription({ task }: TaskDescriptionProps) {
  return (
    <Card>
      <Accordion type="single" defaultValue="description" collapsible>
        <AccordionItem value="description" className="border-none">
          <CardHeader className="p-4 sm:p-6">
            <AccordionTrigger className="p-0 hover:no-underline">
              <CardTitle className="text-xl font-semibold">Description</CardTitle>
            </AccordionTrigger>
          </CardHeader>
          <AccordionContent>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              {task.image_path && (
                <div className="mb-4">
                  <img
                    src={task.image_path}
                    alt={task.name}
                    className="rounded-lg object-cover"
                    style={{ maxHeight: "400px", width: "100%" }}
                  />
                </div>
              )}
              <div className="prose dark:prose-invert max-w-none">
                {task.description ? (
                  <div dangerouslySetInnerHTML={{ __html: task.description }} />
                ) : (
                  <p className="text-muted-foreground">No description provided.</p>
                )}
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
