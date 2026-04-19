import { userRepository } from "@/lib/repository/user"
import { ok } from "@/lib/api/response"
import { requireAdmin } from "@/lib/api/auth"

export async function GET() {
  const sessionOrResponse = await requireAdmin()
  if (sessionOrResponse instanceof Response) return sessionOrResponse
  const users = await userRepository.getAllUsers()
  return ok({ users })
}
