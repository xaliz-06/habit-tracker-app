"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { colorSelectOptions } from "@/lib/colors/colorUtils";
import { useMutation } from "@tanstack/react-query";
import { createHabit } from "@/actions/create-new-habit";
import { authClient } from "@/lib/auth-client";
import { Loader2, Loader2Icon, MessageCircleWarningIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const formSchema = z.object({
  habitName: z.string().min(1, {
    message: "Habit name is required",
  }),
  habitDescription: z.string().optional(),
  habitFrequency: z.enum(["daily", "weekly", "monthly"], {
    errorMap: () => ({ message: "Please select a frequency" }),
  }),
  habitIsRepeatable: z.boolean(),
  habitColorScheme: z.string(),
});

const AddHabitForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      habitName: "",
      habitDescription: "",
      habitFrequency: "daily",
      habitIsRepeatable: false,
      habitColorScheme: "red",
    },
  });

  const {
    data: session,
    isPending: isPendingUser, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  if (error) {
    refetch();
    return (
      <div className="text-center text-rose-500 flex items-center justify-center">
        <MessageCircleWarningIcon className="h-4 w-4 " /> Error loading user.
        Please try again.
      </div>
    );
  }

  const {
    mutateAsync: addHabit,
    isPending,
    error: addError,
    isSuccess,
  } = useMutation({
    mutationFn: createHabit,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (session && session.user) {
      const res = await addHabit({
        name: values.habitName,
        description: values.habitDescription,
        color: values.habitColorScheme,
        isRepeatable: values.habitIsRepeatable,
        frequency: values.habitFrequency,
        userId: session.user.id,
      });

      if (addError) {
        toast.error("Failed to create habit. Please try again.");
        return;
      }

      if (res.success) {
        form.reset();
        toast.success("Habit created successfully!");
      }
    }
  };
  if (isPendingUser) {
    return (
      <div className="max-w-md mx-auto mt-4 space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-1/2" />
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-4 rounded-lg shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="habitName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Habit Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Drink water" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="habitDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your habit..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row gap-4 w-full">
            <FormField
              control={form.control}
              name="habitFrequency"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Frequency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="habitColorScheme"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <div className="flex items-center w-full">
                          <SelectValue placeholder="Select a color" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colorSelectOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center">
                            <div
                              className={`w-4 h-4 rounded-full mr-2 ${color.colorClass}`}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="habitIsRepeatable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Repeatable</FormLabel>
                  <FormDescription>
                    Can this habit be done multiple times per day?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full font-semibold text-lg cursor-pointer"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Create Habit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default AddHabitForm;
