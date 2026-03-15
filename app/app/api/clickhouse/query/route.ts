import { z } from "zod";
import { createDbClient } from "@/lib/db/factory";
import { NextRequest, NextResponse } from "next/server";

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

    const client = createDbClient(url);
    const data = await client.executeQuery(query);

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
