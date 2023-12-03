"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { type DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Button,
  Input,
  Form,
  Skeleton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Calendar,
} from "~/components";
import { cn } from "~/lib";
import { type ActivitiesRecord } from "~/server/db";
// import { api } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  start: z.string().min(1, "Required"),
  end: z.string().optional(),
  category: z.string().optional(),
});

type Props = {
  // departmentId: string;
  className?: string;
  activity?: ActivitiesRecord;
  isSubmitting: boolean;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};

export const ActivitiesForm = (props: Props) => {
  // const {data, isLoading} = api.categories.getByDepartmentId.useQuery({

  // });
  const [date, setDate] = useState<DateRange | undefined>({
    from: props.activity?.start
      ? new Date(props.activity.start.toString())
      : undefined,
    to: props.activity?.end
      ? new Date(props.activity.end.toString())
      : undefined,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.activity?.name ?? "",
      start: props.activity?.start
        ? new Date(props.activity.start.toString()).toISOString()
        : undefined,
      end: props.activity?.end
        ? new Date(props.activity.end.toString()).toISOString()
        : undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    props.onSubmit(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "flex flex-grow flex-col justify-between gap-8 md:justify-normal",
          props.className,
        )}
      >
        <div className="flex flex-col gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <label className="flex flex-col gap-3" htmlFor="date">
            <span
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                {
                  "text-destructive": form.getFieldState("start").error,
                },
              )}
            >
              Date*
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
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
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={(values) => {
                    form.clearErrors("start");
                    let date = values;
                    if (
                      values?.from?.toISOString() === values?.to?.toISOString()
                    ) {
                      date = { from: values?.from, to: undefined };
                    }

                    form.setValue("start", date?.from?.toISOString() ?? "");

                    form.setValue("end", date?.to?.toISOString() ?? "");

                    setDate(date);
                  }}
                />
              </PopoverContent>
            </Popover>
            {form.getFieldState("start").error && (
              <p className="text-sm font-medium text-destructive">
                Start date is required
              </p>
            )}
          </label>
        </div>

        <Button type="submit" disabled={props.isSubmitting}>
          {!!props.activity ? "Edit" : "Create"}
        </Button>
      </form>
    </Form>
  );
};

export const ActivitiesFormSkeleton = () => {
  return (
    <div className="flex flex-grow flex-col justify-between gap-8 md:justify-normal">
      <div className="flex flex-col gap-8">
        <div className="flex w-full flex-col gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex w-full flex-col gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex w-full flex-col gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
