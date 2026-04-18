import { z } from "zod";
import { NextRequest } from "next/server";
import { ConversationRepository } from "@/lib/repository/conversation";
import { ok, fail } from "@/lib/api/response";

const RequestSchema = z.object({
  userId: z.string().min(1),
  title: z.string().optional(),
});

const repository = new ConversationRepository();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, title } = RequestSchema.parse(body);
    const doc = await repository.create(userId, title);
    return ok(doc, 201);
  } catch (error) {
    return fail(error);
  }
}
