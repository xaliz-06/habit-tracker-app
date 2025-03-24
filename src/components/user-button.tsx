"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon, User2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  name: string;
  email: string;
};

const UserButton = ({ name, email }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSignOut = async () => {
    setIsLoading(true);
    const { data, error } = await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/sign-in"); // redirect to login page
        },
      },
    });

    if (error) {
      setIsLoading(false);

      toast.error("Failed to log you out! Please try again.");
    }

    if (data && data.success) {
      setIsLoading(false);

      toast.success("Log out successful!");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-12 h-12 rounded-full" variant={"outline"}>
          <User2Icon className="w-8 h-8" />
          <span className="sr-only">My account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4 mt-2 w-[15vw] bg-background">
        <DropdownMenuLabel className="font-bold text-lg">
          Hello!
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col space-y-1 p-2">
          <p className="font-semi-bold text-lg">{name}</p>
          <p className="font-light text-sm tracking-tight">{email}</p>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
        <DropdownMenuSeparator />

        <Button
          variant={"destructive"}
          className="w-full text-md cursor-pointer hover:bg-destructive-foreground"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2Icon
              className="animate-spin text-muted-foreground"
              size={32}
            />
          ) : (
            "Sign out"
          )}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
