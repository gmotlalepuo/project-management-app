import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Task } from "@/types/task";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import { Button } from "@/Components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type TaskDescriptionProps = {
  task: Task;
};

export function TaskDescription({ task }: TaskDescriptionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Description</CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown
                  className={cn("h-4 w-4 transition-all", {
                    "rotate-180": isOpen,
                  })}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="prose dark:prose-invert max-w-none">
              {task.description || (
                <p className="text-muted-foreground">No description provided.</p>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
