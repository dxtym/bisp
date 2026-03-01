import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { ConversationRepository } from "@/lib/repository/conversation";

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
    const body = await req.json();

    const validation = AddMessageSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid request data",
      }, { status: 400 });
    }

    const { message } = validation.data;

    const conversation = await repository.addMessage(id, message);
    if (!conversation) {
      return NextResponse.json({
        success: false,
        message: "Conversation not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: conversation,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    }, { status: 500 });
  }
}
