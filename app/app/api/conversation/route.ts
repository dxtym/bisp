import { NextRequest } from "next/server";
import { ConversationRepository } from "@/lib/repository/conversation";
import { ok, fail } from "@/lib/api/response";

const repository = new ConversationRepository();

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("user_id");
    if (!userId) return fail("user_id query parameter is required", 400);
    const conversations = await repository.getAll(userId);
    return ok(conversations);
  } catch (error) {
    return fail(error);
  }
}
