"use server";

import { FormValues } from "@/lib/types/createAccountDTO";
import { auth } from "@/server/lib/auth";
import { revalidatePath } from "next/cache";

export async function signUpAction(input: FormValues) {
  const { name, email, password } = input;

  const data = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  revalidatePath("/", "layout");
  return data;
}
