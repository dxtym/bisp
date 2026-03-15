import postgres from "postgres";
import { DbClient } from "@/lib/db/types";

export class PostgresClient implements DbClient {
  private readonly sql: ReturnType<typeof postgres>;

  constructor(url: string) {
    this.sql = postgres(url);
  }

  async executeQuery(query: string): Promise<Record<string, unknown>[]> {
    const rows = await this.sql.unsafe(query);
    return rows as Record<string, unknown>[];
  }

  async ping(): Promise<boolean> {
    try {
      await this.sql`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
