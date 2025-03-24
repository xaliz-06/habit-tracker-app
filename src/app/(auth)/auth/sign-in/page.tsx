"use client";

import { SignInForm } from "@/components/auth-forms/sign-in";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center mt-6 md:mt-8 lg:mt-14">
      <Card className="px-6 py-4 flex flex-col w-[90vw] md:w-[70vw] lg:w-[50vw] bg-accent/60">
        <CardHeader className="text-3xl font-bold text-center">
          Sign In!
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col space-y-4">
          <SignInForm />
        </CardContent>
        <CardFooter className="mt-6 flex items-center justify-center">
          <p className="text-xs font-light tracking-wide">
            Habit Tracker is a hobby project!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
