import { ThemeProvider } from "next-themes";
import React from "react";
import { QueryProvider } from "./query-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider className="flex flex-row gap-6">
          {children}
        </SidebarProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
