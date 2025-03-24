"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useRouter } from "next/navigation";
import { useGetSession } from "@/hooks/auth/use-get-session";
import { authClient } from "@/lib/auth-client";
import { Loader2Icon } from "lucide-react";
import UserButton from "./user-button";

const Navbar = () => {
  const navigation = useRouter();
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const handleCreateAccount = () => {
    navigation.push("/auth/sign-up");
  };

  const handleUserProfile = () => {
    navigation.push("/profile");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 h-[10vh] container w-full sticky top-0 z-10 bg-background/95 border-b backdrop-blur supports-[backdrop-filter]:bg-background/20 shadow-lg">
      <div className="flex items-center justify-center">
        <h1 className="text-4xl font-bold tracking-tighter">Habit Tracker</h1>
      </div>
      <div className="gap-2 flex items-center">
        <ModeToggle />
        {isPending ? (
          <Button variant="default" disabled className="w-12 h-12 rounded-full">
            <Loader2Icon className="w-8 h-8 animate-spin" />
          </Button>
        ) : session ? (
          <UserButton name={session.user.name} email={session.user.email} />
        ) : (
          <Button
            variant="default"
            className="px-4 py-2 font-semibold cursor-pointer"
            onClick={handleCreateAccount}
          >
            Create account
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
