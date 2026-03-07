import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { userRepository } from "@/lib/repository/user";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized"
    }, { status: 401 });
  }

  const queriesCount = await userRepository.getQueriesCount(session.user.id);
  if (queriesCount === null) {
    return NextResponse.json({
      message: "User not found"
    }, { status: 404 });
  }

  return NextResponse.json({
    queriesCount
  }, { status: 200 });
}
