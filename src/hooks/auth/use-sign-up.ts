import { signUpAction } from "@/actions/sign-up-action";
import { FormValues } from "@/lib/types/createAccountDTO";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignUp = (onSuccess?: () => void, refetch?: () => void) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (input: FormValues) => {
      const res = await signUpAction(input);

      if (!res.token) {
        throw new Error("Failed to create account!");
      }

      return res;
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      if (refetch) refetch();
      if (onSuccess) onSuccess();
      router.push("/");
    },
    onError: () => {
      toast.error("Failed to create account!");
    },
  });

  return mutation;
};
