import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SignUpData {
  username: string;
  email: string;
  password: string;
}

interface UseHandleSignUpProps {
  setLoading: (loading: boolean) => void;
}

export function useHandleSignUp({ setLoading }: UseHandleSignUpProps) {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();

  const handleSignUp = async (e: React.FormEvent, data: SignUpData) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (!data.username.trim()) {
      toast.error("Ism kiritish majburiy");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp.create({
        emailAddress: data.email,
        password: data.password,
        username: data.username,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        try {
          await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: data.username,
              email: data.email,
            }),
          });
        } catch (error) {
          console.error("Something went wrong:", error);
        }
        router.push("/");
      } else if (result.status === "missing_requirements") {
        toast.error("Emailingizni tekshiring.");
      } else {
        toast.error("Qaytadan urinib ko'ring.");
      }
    } catch {
      toast.error("Nomalum xatolik");
    } finally {
      setLoading(false);
    }
  };

  return { handleSignUp };
}
