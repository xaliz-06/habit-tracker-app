import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Providers from "@/lib/providers/providers";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Tracker App",
  description: "A work-in-progress habit tracker app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <AppSidebar />
          <main className="flex flex-1 bg-background flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-col flex-1">{children}</div>
          </main>
          <Toaster richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
