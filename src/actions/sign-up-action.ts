"use server";

import { authClient } from "@/lib/auth-client";
import { FormValues } from "@/lib/types/createAccountDTO";

export async function signUpAction(input: FormValues) {
  const { name, email, password } = input;

  return await authClient.signUp.email({
    email,
    password,
    name,
    callbackURL: "/",
  });
}
