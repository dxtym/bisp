"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Sidebar from "@/components/sidebar"

export default function Page() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    setLoading(false)

    if (res.ok) {
      router.push("/sign-in")
    } else {
      const data = await res.json()
      setError(data.message || "Xatolik yuz berdi")
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar className="hidden lg:flex lg:w-1/2" />
      <div className="flex w-full lg:w-1/2 items-center justify-center px-8 bg-muted/30">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-1 text-center">
            <h1 className="text-xl font-semibold">Ro&apos;yxatdan o&apos;tish</h1>
            <p className="text-sm text-muted-foreground">
              Yangi hisob yarating.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ism</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ismingiz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="capitalize border-neutral-700" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="siz@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-neutral-700"
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
                minLength={8}
                className="border-neutral-700" 
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" variant="secondary" className="w-full mt-3 border border-neutral-500 hover:border-neutral-600" disabled={loading}>
              {loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground">
            Hisobingiz bormi?{" "}
            <Link href="/sign-in" className="underline underline-offset-4">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
