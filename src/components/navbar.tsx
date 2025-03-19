"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const navigation = useRouter();

  const handleCreateAccount = () => {
    navigation.push("/auth/sign-up");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 h-[10vh] container w-full sticky top-0 z-10 bg-background/95 border-b backdrop-blur supports-[backdrop-filter]:bg-background/20 shadow-lg">
      <div className="flex items-center justify-center">
        <h1 className="text-4xl font-bold tracking-tighter">Habit Tracker</h1>
      </div>
      <div className="gap-2 flex items-center">
        <ModeToggle />
        <Button
          variant="default"
          className="px-4 py-2 font-semibold cursor-pointer"
          onClick={handleCreateAccount}
        >
          Create account
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
