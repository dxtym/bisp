import { NextRequest, NextResponse } from "next/server";

import { ClickHouseWebClient } from "@/lib/clickhouse/client";
import { SystemRepository } from "@/lib/repository/system";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json({
        success: false,
        message: "No connection URL provided",
      }, { status: 400 });
    }

    const client = new ClickHouseWebClient(url);
    const systemRepository = new SystemRepository(client);
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
