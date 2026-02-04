import { z } from "zod";
import { Conversation } from "@/lib/mongodb/models/conversation";
import { NextRequest, NextResponse } from "next/server";
import { mongoDbConnect } from "@/lib/mongodb/client";

const RequestSchema = z.object({
  userId: z.string().min(1),
  title: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await mongoDbConnect();

    const body = await req.json();
    const { userId, title } = RequestSchema.parse(body);

    const doc = await Conversation.create({
      userId: userId,
      conversationId: crypto.randomUUID(),
      title: title,
      messages: [],
    });

    return NextResponse.json({
      success: true,
      message: JSON.stringify(doc),
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong"
    });
  }
}
