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
  Skeleton,
} from "~/components";
import { cn } from "~/lib";
import { type GroupsRecord } from "~/server/db";

const formSchema = z.object({
  name: z.string().min(1, "Required"),
});

type Props = {
  className?: string;
  group?: GroupsRecord;
  isSubmitting: boolean;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};

export const GroupsForm = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.group?.name ?? "",
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder="Selam" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={props.isSubmitting}>
          {!!props.group ? "Edit" : "Create"}
        </Button>
      </form>
    </Form>
  );
};

export const GroupsFormSkeleton = () => {
  return (
    <div className="flex flex-grow flex-col justify-between gap-8 md:justify-normal">
      <div className="flex w-full flex-col gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
