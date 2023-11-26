"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Skeleton,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "~/components";
import { api } from "~/trpc/react";
import { cn, generateArray } from "~/lib";
import { type MembersRecord } from "~/server/db";
import { format } from "date-fns";

type Props = {
  className?: string;
  member?: MembersRecord;
  isSubmitting: boolean;
  onSubmit: (values: z.infer<typeof memberSchema>) => void;
};

const memberSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  gender: z.string().optional(),
});

export const MembersForm = (props: Props) => {
  const { data: genders, isLoading } = api.genders.getAll.useQuery();

  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: props.member?.firstName ?? "",
      lastName: props.member?.lastName ?? "",
      address: props.member?.address ?? "",
      dateOfBirth: props.member?.dateOfBirth
        ? format(new Date(props.member?.dateOfBirth.toString()), "yyyy-MM-dd")
        : "",
      phoneNumber: props.member?.phoneNumber ?? "",
      gender: props.member?.gender?.id ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof memberSchema>) {
    props.onSubmit(values);
  }

  if (isLoading) return <MembersFormSkeleton />;

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
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name*</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name*</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of birth</FormLabel>
                <FormControl>
                  <Input {...field} type="date" className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Street 123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input placeholder="+32 4XX XX XX XX" {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders?.map((gender) => (
                        <SelectItem key={gender.id} value={gender.id}>
                          {gender.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={props.isSubmitting}>
          {props.member ? "Edit" : "Create"}
        </Button>
      </form>
    </Form>
  );
};

export const MembersFormSkeleton = () => {
  return (
    <div className="flex flex-grow flex-col justify-between gap-8 md:justify-normal">
      <div className="flex flex-col gap-4">
        {generateArray(6).map((val) => (
          <div key={val} className="flex w-full flex-col gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
