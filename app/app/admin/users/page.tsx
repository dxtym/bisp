"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { ArrowLeft, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"
import GridBackground from "@/components/grid-background"
import UserAvatar from "@/components/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
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

const PAGE_SIZE = 10
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
  const [emailFilter, setEmailFilter] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(0)

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

  const filteredUsers = users
    .filter((u) => u.email.toLowerCase().includes(emailFilter.toLowerCase()))
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE)
  const pagedUsers = filteredUsers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const allPageSelected = pagedUsers.length > 0 && pagedUsers.every((u) => selected.has(u.id))

  function toggleSelect(id: string) {
    setSelected((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }
  function toggleSelectAll() {
    setSelected((prev) => {
      const s = new Set(prev)
      allPageSelected ? pagedUsers.forEach((u) => s.delete(u.id)) : pagedUsers.forEach((u) => s.add(u.id))
      return s
    })
  }

  return (
    <div className="relative min-h-screen flex flex-col text-foreground">
      <GridBackground />
      <main className="flex-1 flex flex-col p-8">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-5" />
              Orqaga
            </Link>
            <UserAvatar name={session?.user?.name} image={session?.user?.image} />
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
            <div className="rounded-sm border border-black/15 dark:border-white/15 bg-white dark:bg-neutral-950 p-4 shadow-lg">
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
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">Ro&apos;yxat</h2>
              <Input
                placeholder="Emailni filtrlash..."
                value={emailFilter}
                onChange={(e) => { setEmailFilter(e.target.value); setPage(0) }}
                className="max-w-xs h-8 text-sm bg-white dark:bg-neutral-950"
              />
            </div>
            <div className="rounded-sm border border-black/15 dark:border-white/15 overflow-hidden bg-white dark:bg-neutral-950 shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-10 pl-4 align-middle">
                      <input
                        type="checkbox"
                        checked={allPageSelected}
                        onChange={toggleSelectAll}
                        className="size-4 rounded-sm border border-input accent-foreground cursor-pointer align-middle"
                      />
                    </TableHead>
                    <TableHead>Foydalanuvchi</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tarif</TableHead>
                    <TableHead className="text-center">Holat</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className={`transition-colors ${user.disabled ? "opacity-50" : ""} ${selected.has(user.id) ? "bg-muted/40" : ""}`}
                    >
                      <TableCell className="pl-4 align-middle" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(user.id)}
                          onChange={() => toggleSelect(user.id)}
                          className="size-4 rounded-sm border border-input accent-foreground cursor-pointer align-middle"
                        />
                      </TableCell>
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
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20 shrink-0">
                              admin
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                      <TableCell className="text-sm">{PLAN_LABELS[user.plan] ?? user.plan}</TableCell>
                      <TableCell>
                        <span className={`size-2 rounded-full block mx-auto ${user.disabled ? "bg-destructive" : "bg-emerald-500"}`} />
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
                              className={user.disabled ? "text-emerald-600 dark:text-emerald-400" : "text-destructive focus:text-destructive"}
                            >
                              {loadingAction === user.id ? "..." : user.disabled ? "Faollashtirish" : "Faolsizlantirish"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pagedUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-10 text-sm">
                        Foydalanuvchilar topilmadi
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span>{selected.size} of {filteredUsers.length} qator tanlandi.</span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="size-7" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="outline" size="icon" className="size-7" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
