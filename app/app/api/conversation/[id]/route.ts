import { NextRequest, NextResponse } from "next/server";
import { ConversationRepository } from "@/lib/repository/conversation";

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
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({
        success: false,
        message: "Title required",
      }, { status: 400 });
    }

    const conversation = await repository.updateTitle(id, title.trim());

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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const conversation = await repository.delete(id);

    if (!conversation) {
      return NextResponse.json({
        success: false,
        message: "Conversation not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Conversation deleted successfully",
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    }, { status: 500 });
  }
}
