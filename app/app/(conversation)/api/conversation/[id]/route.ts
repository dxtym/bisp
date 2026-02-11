import { NextRequest, NextResponse } from "next/server";
import { ConversationRepository } from "@/app/_repository/conversation";

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
