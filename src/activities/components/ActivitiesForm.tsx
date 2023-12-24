"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
  DateRangeInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  InputSkeleton,
  ButtonSkeleton,
} from "~/components";
import { cn, generateArray } from "~/lib";
import { type ActivitiesRecord } from "~/server/db";
import { api } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  start: z.string().min(1, "Required"),
  end: z.string().optional(),
  department: z.string().min(1, "Required"),
  category: z.string().optional(),
});

type Props = {
  className?: string;
  activity?: ActivitiesRecord;
  isSubmitting: boolean;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};

export const ActivitiesForm = (props: Props) => {
  const { data: departments, isLoading: isLoadingDepartments } =
    api.departments.getAll.useQuery({});

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
      department: props.activity?.department?.id ?? "",
      category: props.activity?.category?.id ?? "",
    },
  });
  const {
    data: categories,
    // isLoading: isLoadingCategories,
    isFetching: isFetchingCategories,
    refetch: refetchCategories,
  } = api.categories.getByDepartmentId.useQuery(
    {
      departmentId: form.getValues("department"),
    },
    {
      enabled: !!form.getValues("department"),
    },
  );

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
        <div className="flex flex-col gap-4">
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

          <DateRangeInput
            label="Date"
            name="date"
            required
            date={date}
            error={form.getFieldState("start").error}
            defaultMonth={date?.from}
            selected={date}
            onSelect={(values) => {
              form.clearErrors("start");
              let date = values;
              if (values?.from?.toISOString() === values?.to?.toISOString()) {
                date = { from: values?.from, to: undefined };
              }

              form.setValue("start", date?.from?.toISOString() ?? "");

              form.setValue("end", date?.to?.toISOString() ?? "");

              setDate(date);
            }}
          />
          {isLoadingDepartments ? (
            <InputSkeleton />
          ) : (
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department*</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={async (values) => {
                        field.onChange(values);
                        form.setValue("category", "");
                        await refetchCategories();
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments?.records.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {isFetchingCategories ? (
            <InputSkeleton />
          ) : (
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
        {generateArray(4).map((val) => (
          <InputSkeleton key={val} />
        ))}
      </div>
      <ButtonSkeleton />
    </div>
  );
};
