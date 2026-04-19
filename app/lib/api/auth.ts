import type { Session } from "next-auth"
import type { NextResponse } from "next/server"
import { auth } from "@/auth"
import { fail } from "@/lib/api/response"

export async function requireAuth(): Promise<Session | NextResponse> {
  const session = await auth()
  if (!session?.user?.id) return fail("Unauthorized", 401)
  return session
}

export async function requireAdmin(): Promise<Session | NextResponse> {
  const session = await auth()
  if (session?.user?.role !== "admin") return fail("Forbidden", 403)
  return session as Session
}
