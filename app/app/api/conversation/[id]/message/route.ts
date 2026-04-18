import { z } from "zod";
import { NextRequest } from "next/server";
import { ConversationRepository } from "@/lib/repository/conversation";
import { ok, fail } from "@/lib/api/response";

const AddMessageSchema = z.object({
  message: z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().min(1),
    createdAt: z.coerce.date(),
  }),
});

const repository = new ConversationRepository();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const validation = AddMessageSchema.safeParse(await req.json());
    if (!validation.success) return fail("Invalid request data", 400);
    const conversation = await repository.addMessage(id, validation.data.message);
    if (!conversation) return fail("Conversation not found", 404);
    return ok(conversation);
  } catch (error) {
    return fail(error);
  }
}
