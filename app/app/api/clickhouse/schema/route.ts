import { NextRequest, NextResponse } from "next/server";

import { detectDbType, createDbClient, createSystemRepository } from "@/lib/db/factory";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json({
        success: false,
        message: "No connection URL provided",
      }, { status: 400 });
    }

    const type = detectDbType(url);
    const client = createDbClient(url);
    const systemRepository = createSystemRepository(client, type);
    const schema = await systemRepository.loadSchema();

    return NextResponse.json({
      success: true,
      data: schema,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    }, { status: 500 });
  }
}
