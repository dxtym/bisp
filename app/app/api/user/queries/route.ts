import { userRepository } from "@/lib/repository/user";
import { ok, fail } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";

export async function GET() {
  const sessionOrResponse = await requireAuth();
  if (sessionOrResponse instanceof Response) return sessionOrResponse;
  const session = sessionOrResponse;

  const quota = await userRepository.getQuotaInfo(session.user.id);
  if (quota === null) {
    return fail("User not found", 404);
  }

  return ok(quota);
}
