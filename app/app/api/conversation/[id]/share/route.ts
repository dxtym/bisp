import { NextRequest } from "next/server";
import { ConversationRepository } from "@/lib/repository/conversation";
import { ok, fail } from "@/lib/api/response";
import { requireConversationOwner } from "@/lib/api/conversation-auth";

const repository = new ConversationRepository();

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { error, conversation: existing } = await requireConversationOwner(id);
    if (error) return error;

    const token = existing.shareToken ?? crypto.randomUUID();
    const conversation = await repository.setShareToken(id, token);
    return ok({ shareToken: token, shareUrl: `/s/${token}`, conversation });
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { error } = await requireConversationOwner(id);
    if (error) return error;

    const conversation = await repository.setShareToken(id, null);
    return ok({ conversation });
  } catch (error) {
    return fail(error);
  }
}
