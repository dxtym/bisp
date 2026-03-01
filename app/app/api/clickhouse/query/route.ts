import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ClickHouseWebClient } from "@/lib/clickhouse/client";

const QueryRequest = z.object({
  query: z.string(),
  url: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, url } = QueryRequest.parse(body);

    if (!url) {
      return NextResponse.json({
        success: false,
        message: "No connection URL provided",
      }, { status: 400 });
    }

    const client = new ClickHouseWebClient(url);
    const result = await client.query({ query });
    const data = await result.json();

    return NextResponse.json({
      success: true,
      data: data,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    }, { status: 500 });
  }
}
