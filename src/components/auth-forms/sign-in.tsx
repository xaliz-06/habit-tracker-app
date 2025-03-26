"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

import { formSchema, FormValues } from "@/lib/types/signInDTO";
import { cn } from "@/lib/utils";
import { useSignIn } from "@/hooks/auth/use-sign-in";
import { authClient } from "@/lib/auth-client";

export const SignInForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const { refetch } = authClient.useSession();
  const mutation = useSignIn(() => form.reset(), refetch);

  const { isDirty, isValid } = form.formState;

  const isDisabled = !isDirty ? false : !isValid;

  const handleSubmit = (values: FormValues) => {
    mutation.mutate(values);

    // Simulate a successful form submission
    // setIsLoading(true);
    // setTimeout(() => {
    //   setIsLoading(false);
    //   setIsSuccess(true);
    // }, 5000);
  };

  const password = useWatch({ control: form.control, name: "password" });

  const validatePasswordFormat = (value: string) => {
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    return hasNumber && hasSpecialChar;
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4 w-ful"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:gap-4 w-full">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1 flex flex-col">
                <FormLabel className="pb-1 text-lg">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    placeholder="Your Email e.g. mattmurdockda@nmp.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:gap-4 w-full">
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1 flex flex-col">
                <FormLabel className="pb-1 text-lg">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    placeholder="Your very secure password"
                  />
                </FormControl>
                <FormMessage />
                {password && !validatePasswordFormat(password) && (
                  <div className="text-sm text-red-500">
                    Password must contain at least one number and one special
                    character.
                  </div>
                )}
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:gap-4 w-full mt-4">
          {!mutation.isSuccess && (
            <Button
              variant={"default"}
              disabled={isDisabled || mutation.isPending}
              className={cn(
                "w-full py-4 h-[3rem] text-center text-xl font-semibold",
                isDisabled ? "cursor-not-allowed" : "cursor-pointer"
              )}
            >
              {mutation.isPending ? (
                <div className="flex items-center justify-center gap-4">
                  <Loader2
                    className="animate-spin text-muted-foreground"
                    size={32}
                  />{" "}
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          )}
          {mutation.isSuccess && (
            <div className="flex items-center justify-center gap-4 w-full py-4 h-[3rem] text-center text-xl font-semibold bg-green-700 text-white rounded-lg">
              Signed in! Redirecting...
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};
