import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SignInData {
  email: string;
  password: string;
}

interface UseHandleSignInProps {
  setLoading: (loading: boolean) => void;
}

export function useHandleSignIn({ setLoading }: UseHandleSignInProps) {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const handleSignIn = async (e: React.FormEvent, data: SignInData) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        toast.error("Email yoki parol xato");
      }
    } catch {
      toast.error("Nomalum xatolik");
    } finally {
      setLoading(false);
    }
  };

  return { handleSignIn };
}
