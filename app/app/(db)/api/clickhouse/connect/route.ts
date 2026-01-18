import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { ClickHouseWebClient } from "@/lib/clickhouse/client";

const Request = z.object({
  connectionString: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { connectionString } = Request.parse(body);

    const client = ClickHouseWebClient.getInstance(connectionString);
    const pingResponse = await client.ping();
    if (!pingResponse.success) {
      return NextResponse.json({
        success: false,
        message: "Ping failed"
      })
    }

    return NextResponse.json({
      success: true,
      message: "Connected to ClickHouse",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong"
    });
  }
}
