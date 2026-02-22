import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { userRepository } from "@/lib/repository/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("CLERK_WEBHOOK_SECRET not found ");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Headers not found" },
      { status: 400 }
    );
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let event: WebhookEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json(
      { error: "Verify headers error" },
      { status: 400 }
    );
  }

  if (event.type === "user.created") {
    const { id, email_addresses, username } = event.data;
    try {
      await userRepository.createUser({
        clerkId: id,
        username: username || email_addresses[0]?.email_address.split("@")[0] || "user",
        email: email_addresses[0]?.email_address || "",
      });
    } catch (error) {
      console.error("Create user error:", error);
    }
  }

  return NextResponse.json({ success: true });
}
