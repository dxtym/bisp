import { z } from "zod";
import mongoDbClient from "@/lib/mongodb/client";
import { Conversation } from "@/lib/mongodb/models/conversation";
import { NextRequest, NextResponse } from "next/server";

const RequestSchema = z.object({
  userId: z.string().min(1),
  title: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, title } = RequestSchema.parse(body);
    console.log(userId, title)

    await mongoDbClient.connect();
    console.log("here")

    const doc = await Conversation.create({
      userId: userId,
      conversationId: crypto.randomUUID(),
      title: title,
      messages: [],
    });
    
    console.log(JSON.stringify(doc))

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
