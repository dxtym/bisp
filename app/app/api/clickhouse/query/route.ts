import { z } from "zod";
import { NextRequest } from "next/server";
import { createDbClient } from "@/lib/db/factory";
import { ok, fail } from "@/lib/api/response";

const QueryRequest = z.object({
  query: z.string(),
  url: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const { query, url } = QueryRequest.parse(await request.json());
    if (!url) return fail("No connection URL provided", 400);
    const client = createDbClient(url);
    const data = await client.executeQuery(query);
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}
