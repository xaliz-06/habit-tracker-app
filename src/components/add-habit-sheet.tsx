"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import AddHabitForm from "./add-habit-form";

const AddHabitSheet = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <div className="bg-primary-button hover:bg-primary-button/80 font-semibold cursor-pointer px-3 py-2 flex items-center gap-2 rounded-lg text-white">
          <PlusIcon className="h-4 w-4" />
          Add New
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold tracking-tighter">
            Add a new habit
          </SheetTitle>
          <SheetDescription>
            Add the details to kickstart your new habit. You can always edit it
            later.
          </SheetDescription>
          <AddHabitForm />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default AddHabitSheet;
