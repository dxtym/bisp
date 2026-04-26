import { NextRequest } from "next/server";
import { ConversationRepository } from "@/lib/repository/conversation";
import { ok, fail } from "@/lib/api/response";
import { requireConversationOwner } from "@/lib/api/conversation-auth";

const repository = new ConversationRepository();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { isPinned } = await req.json();
    if (typeof isPinned !== "boolean") return fail("isPinned must be a boolean", 400);

    const { error } = await requireConversationOwner(id);
    if (error) return error;

    const conversation = await repository.setPinned(id, isPinned);
    return ok(conversation);
  } catch (error) {
    return fail(error);
  }
}
