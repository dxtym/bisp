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
      setError(data.message || data.data?.message || "Xatolik yuz berdi")
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar className="hidden lg:flex lg:w-1/2 border-r border-border" />
      <div className="flex w-full lg:w-1/2 items-center justify-center px-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Royxatdan otish</h1>
            <p className="text-sm text-muted-foreground">Yangi hisob yarating.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Ism</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ismingiz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="capitalize rounded-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="siz@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Parol</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="rounded-sm"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              variant="secondary"
              className="w-full mt-3 rounded-sm bg-foreground text-background! hover:bg-foreground/90 transition-colors"
              disabled={loading}
            >
              {loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground">
            Hisobingiz bormi?{" "}
            <Link href="/sign-in" className="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
