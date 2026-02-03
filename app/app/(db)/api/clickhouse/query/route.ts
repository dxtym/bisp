import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ClickHouseWebClient } from "@/lib/clickhouse/client";

const QueryRequest = z.object({
  query: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    if (!ClickHouseWebClient.hasInstance()) {
      return NextResponse.json({
        success: false,
        message: "No active ClickHouse instance",
      });
    }

    const body = await request.json();
    const { query } = QueryRequest.parse(body);

    const client = ClickHouseWebClient.getInstance();

    const result = await client.query({ query });
    const data = await result.json();

    return NextResponse.json({
      success: true,
      data: data,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}
