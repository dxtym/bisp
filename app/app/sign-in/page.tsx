"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle } from "react-icons/fa"
import Sidebar from "@/components/sidebar"

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
      <Sidebar className="hidden lg:flex lg:w-1/2" />
      <div className="flex w-full lg:w-1/2 items-center justify-center px-8 bg-white text-zinc-900 [&_label]:text-zinc-700 [&_.text-muted-foreground]:!text-zinc-500">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-1 text-center">
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
                className="border-zinc-800" 
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
                className="border-zinc-800"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" variant="secondary" className="w-full mt-3 border-black hover:border-zinc-700" disabled={loading}>
              {loading ? "Kirish..." : "Kirish"}
            </Button>
          </form>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-sm text-zinc-500">yoki</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>
          <Button
            variant="secondary"
            className="w-full border-black-500 hover:border-zinc-700"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FaGoogle className="size-4" />
            Google orqali kirish
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Hisobingiz yo&apos;qmi?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Royxatdan oting
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
