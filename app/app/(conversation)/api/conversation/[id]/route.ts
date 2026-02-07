import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { ConversationRepository } from "@/app/_repository/conversation";

const UpdateMessagesSchema = z.object({
  messages: z.array(
    z.object({
      senderId: z.string().min(1),
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1),
      createdAt: z.coerce.date().optional().default(() => new Date()),
    })
  ),
});

const repository = new ConversationRepository();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const conversation = await repository.getById(id);

    if (!conversation) {
      return NextResponse.json({
        success: false,
        message: "Conversation not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { messages } = UpdateMessagesSchema.parse(body);

    const conversation = await repository.updateMessages(id, messages);

    if (!conversation) {
      return NextResponse.json({
        success: false,
        message: "Conversation not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}
