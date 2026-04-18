import { NextRequest } from "next/server";
import { detectDbType, createDbClient, createSystemRepository } from "@/lib/db/factory";
import { ok, fail } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");
    if (!url) return fail("No connection URL provided", 400);
    const type = detectDbType(url);
    const client = createDbClient(url);
    const systemRepository = createSystemRepository(client, type);
    const schema = await systemRepository.loadSchema();
    return ok(schema);
  } catch (error) {
    return fail(error);
  }
}
