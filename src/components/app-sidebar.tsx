"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Home,
  Inbox,
  Loader2Icon,
  PlusCircleIcon,
  Search,
  Settings,
} from "lucide-react";
import UserButton from "./user-button";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Separator } from "./ui/separator";

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const navigation = useRouter();

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  if (error) refetch();

  const handleCreateAccount = () => {
    navigation.push("/auth/sign-up");
  };

  const handleSignIn = () => {
    navigation.push("/auth/sign-in");
  };

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
    <Sidebar
      collapsible="icon"
      variant="floating"
      className="ml-2 min-w-[5rem] flex items-center justify-center transition-all"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent
            className={`${isCollapsed && "flex flex-col items-center gap-2"}`}
          >
            {items.map((item) => (
              <SidebarMenuItem key={item.title} className="list-none my-2">
                <div className="cursor-pointer">
                  {state === "collapsed" && (
                    <div className="p-2 rounded-lg hover:bg-muted">
                      <item.icon className="size-8" />
                    </div>
                  )}
                  {state === "expanded" && (
                    <div className="flex items-center gap-2 py-2 px-3 hover:bg-muted rounded-lg">
                      <item.icon className="size-6" />
                      <span className="font-semibold">{item.title}</span>
                    </div>
                  )}
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-4">
        {state === "collapsed" &&
          (isPending ? (
            <Button
              variant="default"
              disabled
              className="w-12 h-12 rounded-full"
            >
              <Loader2Icon className="w-8 h-8 animate-spin" />
            </Button>
          ) : session ? (
            <UserButton name={session.user.name} email={session.user.email} />
          ) : (
            <Button
              variant="default"
              className="w-12 h-12 rounded-full cursor-pointer"
              onClick={handleCreateAccount}
            >
              <PlusCircleIcon className="w-8 h-8" />
            </Button>
          ))}
        {state === "expanded" &&
          (isPending ? (
            <Button
              variant={"secondary"}
              className="w-full text-md cursor-not-allowed"
              disabled={true}
            >
              <Loader2Icon
                className="animate-spin text-muted-foreground"
                size={32}
              />
            </Button>
          ) : session ? (
            <FooterExpanded
              name={session.user.name}
              email={session.user.email}
              handleSignOut={handleSignOut}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <Button
                variant="default"
                className="w-full text-md cursor-pointer"
                onClick={handleSignIn}
              >
                Sign in
              </Button>
              <Button
                variant={"default"}
                className="w-full text-md cursor-pointer"
                onClick={handleCreateAccount}
              >
                Create account
              </Button>
            </div>
          ))}
      </SidebarFooter>
    </Sidebar>
  );
}

type FooterProps = {
  name: string;
  email: string;
  handleSignOut: () => Promise<void>;
  isLoading: boolean;
};

const FooterExpanded = ({
  name,
  email,
  handleSignOut,
  isLoading,
}: FooterProps) => {
  return (
    <SidebarMenu>
      <SidebarMenu>
        <Accordion type="single" className="w-full" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:bg-muted flex justify-center items-center cursor-pointer">
              <p className="px-2 text-xl ">
                Hello, <span className="font-semibold">{name}</span> 👋
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-1 p-2 w-full">
                <p className="font-semi-bold text-lg text-ellipsis">{name}</p>
                <p className="font-light text-sm tracking-tight text-ellipsis overflow-hidden whitespace-nowrap">
                  {email}
                </p>
              </div>
              <Separator />

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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarMenu>
    </SidebarMenu>
  );
};
