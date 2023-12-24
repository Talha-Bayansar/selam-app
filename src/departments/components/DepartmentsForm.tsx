"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
  ButtonSkeleton,
  InputSkeleton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ErrorData,
} from "~/components";
import { cn } from "~/lib";
import { type DepartmentsRecord } from "~/server/db";
import { api } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  groupId: z.string().min(1, "Required"),
});

type Props = {
  className?: string;
  department?: DepartmentsRecord;
  isSubmitting: boolean;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};

export const DepartmentsForm = (props: Props) => {
  const {
    data: groups,
    isLoading: isLoadingGroups,
    error: errorGroups,
  } = api.groups.getAll.useQuery({ size: 50 });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.department?.name ?? "",
      groupId: props.department?.group?.id ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    props.onSubmit(values);
  }

  if (errorGroups) return <ErrorData />;

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
                  <Input placeholder="Yönetim Kurulu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoadingGroups ? (
            <InputSkeleton />
          ) : (
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups?.records.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
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
          {!!props.department ? "Edit" : "Create"}
        </Button>
      </form>
    </Form>
  );
};

export const DepartmentsFormSkeleton = () => {
  return (
    <div className="flex flex-grow flex-col justify-between gap-8 md:justify-normal">
      <InputSkeleton />
      <ButtonSkeleton />
    </div>
  );
};
