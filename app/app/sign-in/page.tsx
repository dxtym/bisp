"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useHandleSignIn } from "@/lib/hooks/use-sign-in";
import { useHandleSignUp } from "@/lib/hooks/use-sign-up";

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface FormState {
  data: FormData;
  loading: boolean;
}

export default function SignInPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState<FormState>({
    data: { username: "", email: "", password: "" },
    loading: false,
  });

  const setLoading = (loading: boolean) => {
    setForm(prev => ({ ...prev, loading }));
  };

  const { handleSignIn } = useHandleSignIn({ setLoading });
  const { handleSignUp } = useHandleSignUp({ setLoading });

  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  const resetForm = () => {
    setForm({
      data: { username: "", email: "", password: "" },
      loading: false,
    });
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    resetForm();
  };

  const onSubmit = (e: React.FormEvent) => {
    if (mode === "signin") {
      handleSignIn(e, { email: form.data.email, password: form.data.password });
    } else {
      handleSignUp(e, form.data);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className={"w-full max-w-sm pb-0 rounded-sm"}>
        <CardHeader className="text-center text-xl">
          <CardTitle>
            {mode === "signin" ? "Kirish" : "Royxatdan otish"}
          </CardTitle>
          <CardDescription>Malumotlaringizni kiriting</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              {mode === "signup" && (
                <div className="grid gap-2">
                  <Label htmlFor="username">Ism</Label>
                  <Input
                    required
                    id="username"
                    type="text"
                    placeholder="Mehmon"
                    autoComplete="username"
                    disabled={form.loading}
                    value={form.data.username}
                    onChange={(e) => updateField("username", e.target.value)}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  required
                  id="email"
                  type="email"
                  placeholder="mehmon@mail.com"
                  autoComplete="email"
                  disabled={form.loading}
                  value={form.data.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Parol</Label>
                <Input
                  required
                  id="password"
                  type="password"
                  placeholder="12345"
                  minLength={8}
                  disabled={form.loading}
                  value={form.data.password}
                  onChange={(e) => updateField("password", e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 border-t bg-neutral-800 rounded-b-sm pb-2">
          <Button
            type="submit"
            className="w-full"
            disabled={form.loading}
            onClick={onSubmit}
          >
            {form.loading ? "Yuklanmoqda..." : mode === "signin" ? "Kirish" : "Royxatdan o'tish"}
          </Button>
          <CardAction className="flex justify-center w-full">
            <Button variant="link" onClick={toggleMode} disabled={form.loading} className="underline">
              {mode === "signin" ? "Hisobingiz yoqmi?" : "Hisobingiz bormi?"}
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
