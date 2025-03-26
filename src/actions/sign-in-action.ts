"use server";

import { FormValues } from "@/lib/types/signInDTO";
import { auth } from "@/server/lib/auth";
import { revalidatePath } from "next/cache";

export async function signInAction(input: FormValues) {
  const { email, password } = input;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  revalidatePath("/", "layout");
  return data;
}
