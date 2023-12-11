import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "~/lib";
import { Popover, PopoverTrigger, Button, PopoverContent, Calendar } from ".";
import { type SelectRangeEventHandler, type DateRange } from "react-day-picker";
import { type FieldError } from "react-hook-form";

type Props = {
  date?: DateRange;
  error?: FieldError;
  defaultMonth?: Date;
  selected?: DateRange;
  onSelect?: SelectRangeEventHandler;
  label?: string;
  name?: string;
  required?: boolean;
  className?: string;
};

export const DateRangeInput = ({
  date,
  error,
  defaultMonth,
  selected,
  onSelect,
  label,
  required = false,
  className,
  name,
}: Props) => {
  return (
    <label className={cn("flex flex-col", className)} htmlFor={name}>
      <span
        className={cn(
          "mb-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          {
            "text-destructive": error,
          },
        )}
      >
        {label}
        {required && "*"}
      </span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={name}
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} -{" "}
                  {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={defaultMonth}
            selected={selected}
            onSelect={onSelect}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="mt-2 text-sm font-medium text-destructive">Required</p>
      )}
    </label>
  );
};
