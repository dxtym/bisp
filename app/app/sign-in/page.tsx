"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LuBookOpen } from "react-icons/lu"
import { FcGoogle } from "react-icons/fc"

export default function Page() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError("Email yoki parol noto'g'ri")
    } else {
      router.push("/")
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block lg:w-1/2" />
      <div className="flex w-full lg:w-1/2 items-center justify-center px-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex items-center gap-2">
            <LuBookOpen className="size-5" />
            <span className="font-medium">Kutoob</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Xush kelibsiz</h1>
            <p className="text-sm text-muted-foreground">
              Hisobingizga kiring.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="siz@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Kirish..." : "Kirish"}
            </Button>
          </form>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">yoki</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FcGoogle className="size-4" />
            Google orqali kirish
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Hisobingiz yo&apos;qmi?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Ro&apos;yxatdan o&apos;ting
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
