import { NextResponse } from "next/server";

import { ClickHouseWebClient } from "@/lib/clickhouse/client";
import { SystemRepository } from "@/lib/repository/system";

export async function GET() {
  try {
    if (!ClickHouseWebClient.hasInstance()) {
      return NextResponse.json({
        success: false,
        message: "No active ClickHouse instance",
      }, { status: 400 });
    }

    const client = ClickHouseWebClient.getInstance();
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
