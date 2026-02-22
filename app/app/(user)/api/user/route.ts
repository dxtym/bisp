import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/lib/repository/user";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 });
    }

    const body = await req.json();
    const { username, email } = body;
    if (!username || !email) {
      return NextResponse.json({
        success: false,
        message: "Username and email required"
      }, { status: 400 });
    }

    const user = await userRepository.createUser({
      clerkId: userId,
      username,
      email,
    });

    return NextResponse.json({
      success: true,
      data: user,
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({
      success: false,
      message,
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 });
    }

    const user = await userRepository.getUserByClerkId(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: user,
    }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({
      success: false,
      message,
    }, { status: 500 });
  }
}
