import * as React from "react";
import { add, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import { TimePickerDemo } from "./time-picker-demo";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  defaultValue?: Date;
  className?: string;
  required?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  defaultValue,
  className,
  required = false,
}: DateTimePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    defaultValue,
  );
  const date = value ?? internalDate;

  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!date) {
      setInternalDate(newDay);
      onChange?.(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    setInternalDate(newDateFull);
    onChange?.(newDateFull);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className,
          )}
          aria-required={required}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP HH:mm:ss")
          ) : (
            <span>{required ? "Pick a date *" : "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
        <div className="border-t border-border p-3">
          <TimePickerDemo
            setDate={(newDate) => {
              setInternalDate(newDate);
              if (newDate) {
                onChange?.(newDate);
              }
            }}
            date={date}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
