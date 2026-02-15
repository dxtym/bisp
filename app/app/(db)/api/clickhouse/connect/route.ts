import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { ClickHouseWebClient } from "@/lib/clickhouse/client";

const Request = z.object({
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = Request.parse(body);

    const client = ClickHouseWebClient.getInstance(url);
    const pingResponse = await client.ping();
    if (!pingResponse.success) {
      return NextResponse.json({
        success: false,
        message: "Ping failed"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Connected to ClickHouse",
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong"
    }, { status: 500 });
  }
}
