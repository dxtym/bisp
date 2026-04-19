import { type NextRequest } from "next/server"
import { userRepository } from "@/lib/repository/user"
import { ok } from "@/lib/api/response"
import { requireAdmin } from "@/lib/api/auth"

export async function GET(req: NextRequest) {
  const sessionOrResponse = await requireAdmin()
  if (sessionOrResponse instanceof Response) return sessionOrResponse
  const days = Math.min(90, Math.max(1, Number(new URL(req.url).searchParams.get("days") ?? 30)))
  const [messageCounts, activeCounts] = await Promise.all([
    userRepository.getDailyMessageCounts(days),
    userRepository.getDailyActiveUsers(days),
  ])
  const activeMap = new Map(activeCounts.map((r) => [r.date, r.activeUsers]))
  const stats = messageCounts.map((s) => ({ ...s, activeUsers: activeMap.get(s.date) ?? 0 }))
  return ok({ stats })
}
