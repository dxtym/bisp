import { NextRequest } from "next/server";
import { ConversationRepository } from "@/lib/repository/conversation";
import { ok, fail } from "@/lib/api/response";

const repository = new ConversationRepository();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const conversation = await repository.getById(id);
    if (!conversation) return fail("Conversation not found", 404);
    return ok(conversation);
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { title } = await req.json();
    if (!title) return fail("Title required", 400);
    const conversation = await repository.updateTitle(id, title.trim());
    if (!conversation) return fail("Conversation not found", 404);
    return ok(conversation);
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
    const deleted = await repository.delete(id);
    if (!deleted) return fail("Conversation not found", 404);
    return ok({ deleted: true });
  } catch (error) {
    return fail(error);
  }
}
