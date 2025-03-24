import { signInAction } from "@/actions/sign-in-action";
import { FormValues } from "@/lib/types/signInDTO";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignIn = (onSuccess?: () => void) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (input: FormValues) => {
      const res = await signInAction(input);

      if (!res.token) {
        throw new Error("Failed to sign in!");
      }

      return res;
    },
    onSuccess: () => {
      toast.success("Signed in successfully!");
      if (onSuccess) onSuccess();
      router.push("/");
    },
    onError: () => {
      toast.error("Failed to sign in!");
    },
  });

  return mutation;
};
