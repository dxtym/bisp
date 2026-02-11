import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { ConversationRepository } from "@/lib/repository/conversation";

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
    return NextResponse.json({
      success: true,
      data: doc,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    }, { status: 500 });
  }
}
