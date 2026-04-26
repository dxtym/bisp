import { NextRequest } from "next/server";
import { ConversationRepository } from "@/lib/repository/conversation";
import { ok, fail } from "@/lib/api/response";

const repository = new ConversationRepository();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const conversation = await repository.getByShareToken(token);
    if (!conversation) return fail("Not found", 404);
    return ok(conversation);
  } catch (error) {
    return fail(error);
  }
}
