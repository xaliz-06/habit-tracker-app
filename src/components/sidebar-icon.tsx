"use client";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import React from "react";
import { useSidebar } from "./ui/sidebar";

const SidebarIcon = () => {
  const { open, toggleSidebar } = useSidebar();
  return open ? (
    <PanelRightClose
      className="w-8 h-8 cursor-pointer"
      onClick={toggleSidebar}
    />
  ) : (
    <PanelRightOpen
      className="w-8 h-8 cursor-pointer"
      onClick={toggleSidebar}
    />
  );
};

export default SidebarIcon;
