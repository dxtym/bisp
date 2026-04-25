"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { ArrowLeft, MoreHorizontal, ShieldCheck } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"
import UserAvatar from "@/components/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" as const },
  }),
}

const chartConfig = {
  count: { label: "So'rovlar", theme: { light: "#171717", dark: "#a3a3a3" } },
  activeUsers: { label: "Faol foydalanuvchilar", theme: { light: "#059669", dark: "#34d399" } },
} satisfies ChartConfig

const PERIODS = [
  { label: "7", days: 7 },
  { label: "30", days: 30 },
  { label: "90", days: 90 },
] as const

type Period = 7 | 30 | 90

const PLAN_LABELS: Record<string, string> = { free: "Bepul", pro: "Pro", max: "Max", team: "Jamoa" }

function SimpleTooltip({ active, payload }: { active?: boolean; payload?: { name?: string; value?: number; color?: string }[] }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded border border-foreground/15 bg-background px-3 py-2 text-xs shadow-md space-y-1">
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="size-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">{p.value ?? 0}</span>
        </div>
      ))}
    </div>
  )
}

type User = {
  id: string
  name: string
  email: string
  image?: string
  plan: "free" | "pro" | "max" | "team"
  role: "admin" | "user"
  disabled: boolean
  queriesCount: number
  createdAt: string
}

type DailyStat = { date: string; count: number; activeUsers: number }

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<DailyStat[]>([])
  const [period, setPeriod] = useState<Period>(30)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (session?.user?.role !== "admin") {
      router.replace("/")
      return
    }
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.data?.users ?? []))
      .catch(console.error)
  }, [session, status, router])

  useEffect(() => {
    if (status === "loading" || session?.user?.role !== "admin") return
    fetch(`/api/admin/stats?days=${period}`)
      .then((r) => r.json())
      .then((d) => setStats(d.data?.stats ?? []))
      .catch(console.error)
  }, [session, status, period])

  async function toggleDisabled(user: User) {
    if (loadingAction) return
    setLoadingAction(user.id)
    try {
      await fetch(`/api/admin/users/${user.id}/deactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disabled: !user.disabled }),
      })
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, disabled: !u.disabled } : u))
    } finally {
      setLoadingAction(null)
    }
  }

  if (status === "loading" || session?.user?.role !== "admin") return null

  return (
    <div className="relative min-h-screen flex flex-col text-foreground">
      <main className="flex-1 flex flex-col px-4 pt-8 pb-6">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-5" />
              Orqaga
            </Link>
            <div className="mr-[3px]">
              <UserAvatar name={session?.user?.name} image={session?.user?.image} />
            </div>
          </div>

          <motion.h1 className="text-3xl font-bold tracking-tight" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            Foydalanuvchilar
          </motion.h1>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">So&apos;rovlar</h2>
              <div className="flex items-center rounded-sm border border-black/10 dark:border-white/10 bg-muted/30 p-0.5 gap-0.5">
                {PERIODS.map(({ label, days }) => (
                  <button
                    key={days}
                    onClick={() => setPeriod(days)}
                    className={`px-4 py-1 text-xs font-medium rounded-sm transition-all duration-200 ${
                      period === days
                        ? "bg-foreground/10 text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-sm border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 p-4 shadow-sm">
              <ChartContainer config={chartConfig} className="h-44 w-full [&_.recharts-cartesian-axis-tick_text]:!fill-foreground">
                <BarChart data={stats} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: string) => v.slice(5)}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} allowDecimals={false} />
                  <ChartTooltip content={<SimpleTooltip />} cursor={{ fill: "currentColor", fillOpacity: 0.05 }} />
                  {stats.length > 0 && (
                    <ReferenceLine
                      y={Math.round(stats.reduce((s, d) => s + d.count, 0) / stats.length)}
                      stroke="currentColor"
                      strokeOpacity={0.25}
                      strokeDasharray="4 4"
                    />
                  )}
                  <Bar dataKey="count" name="So'rovlar" fill="var(--color-count)" fillOpacity={0.6} radius={[4, 4, 0, 0]} maxBarSize={32} activeBar={{ fill: "var(--color-count)", fillOpacity: 1 }} />
                  <Bar dataKey="activeUsers" name="Faol foydalanuvchilar" fill="var(--color-activeUsers)" fillOpacity={0.6} radius={[4, 4, 0, 0]} maxBarSize={32} activeBar={{ fill: "var(--color-activeUsers)", fillOpacity: 1 }} />
                </BarChart>
              </ChartContainer>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Foydalanuvchi</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tarif</TableHead>
                  <TableHead className="text-center">Holat</TableHead>
                  <TableHead className="text-center">Sana</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className={cn("transition-colors", user.disabled && "opacity-50")}
                  >
                    <TableCell className="font-medium cursor-pointer" onClick={() => router.push(`/user/${user.id}`)}>
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full overflow-hidden bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                          {user.image ? (
                            <Image src={user.image} alt={user.name} width={28} height={28} className="object-cover" />
                          ) : (
                            <span>{user.name?.[0]?.toUpperCase() ?? "?"}</span>
                          )}
                        </div>
                        <span>{user.name}</span>
                        {user.role === "admin" && (
                          <ShieldCheck className="size-3.5 shrink-0 text-black dark:text-white" aria-label="admin" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                    <TableCell className="text-sm">{PLAN_LABELS[user.plan] ?? user.plan}</TableCell>
                    <TableCell>
                      <span className={cn("size-2 rounded-full block mx-auto", user.disabled ? "bg-destructive" : "bg-emerald-500")} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground text-center">
                      {new Date(user.createdAt).toLocaleDateString("en-GB").replace(/\//g, ".")}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            disabled={loadingAction === user.id || user.role === "admin"}
                            onClick={() => toggleDisabled(user)}
                            className={cn(user.disabled ? "text-emerald-600 dark:text-emerald-400" : "text-destructive focus:text-destructive")}
                          >
                            {loadingAction === user.id ? "..." : user.disabled ? "Faollashtirish" : "Faolsizlantirish"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-10 text-sm">
                      Foydalanuvchilar topilmadi
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
