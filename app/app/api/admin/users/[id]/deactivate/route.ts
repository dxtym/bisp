import { userRepository } from "@/lib/repository/user"
import { ok, fail } from "@/lib/api/response"
import { requireAdmin } from "@/lib/api/auth"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const sessionOrResponse = await requireAdmin()
  if (sessionOrResponse instanceof Response) return sessionOrResponse
  const session = sessionOrResponse
  const { id } = await params
  if (id === session.user.id) {
    return fail("Cannot deactivate yourself", 400)
  }
  const { disabled } = await req.json()
  await userRepository.setDisabled(id, disabled)
  return ok(null)
}
