import { NextResponse } from "next/server";

import { ClickHouseWebClient } from "@/lib/clickhouse/client";
import { SystemRepository } from "@/app/_repository/system";

export async function GET() {
  try {
    if (!ClickHouseWebClient.hasInstance()) {
      console.log(ClickHouseWebClient.getInstance())
      return NextResponse.json({
        success: false,
        message: "No active ClickHouse instance",
      });
    }

    const client = ClickHouseWebClient.getInstance();
    const systemRepository = new SystemRepository(client);

    const schema = await systemRepository.loadSchema();

    return NextResponse.json({
      success: true,
      data: schema,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}
