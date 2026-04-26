import type { NextResponse } from "next/server";
import type { IConversation } from "@/lib/mongodb/models/conversation";
import { ConversationRepository } from "@/lib/repository/conversation";
import { requireAuth } from "@/lib/api/auth";
import { fail } from "@/lib/api/response";

const repository = new ConversationRepository();

type Result =
  | { conversation: IConversation; error?: never }
  | { error: NextResponse; conversation?: never };

export async function requireConversationOwner(id: string): Promise<Result> {
  const sessionOrResponse = await requireAuth();
  if (sessionOrResponse instanceof Response) return { error: sessionOrResponse };
  const session = sessionOrResponse;

  const conversation = await repository.getById(id);
  if (!conversation) return { error: fail("Conversation not found", 404) };
  if (conversation.userId !== session.user.id) return { error: fail("Forbidden", 403) };
  return { conversation };
}
