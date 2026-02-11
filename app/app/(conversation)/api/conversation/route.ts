import { NextRequest, NextResponse } from "next/server";
import { ConversationRepository } from "@/app/_repository/conversation";

const repository = new ConversationRepository();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "user_id query parameter is required",
      }, { status: 400 });
    }

    const conversations = await repository.getAll(userId);

    return NextResponse.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}
