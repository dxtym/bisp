import { z } from "zod";

import { createClient, PingResult, QueryParams, ResultSet } from "@clickhouse/client-web";

const ClickHouseConfig = z.object({
  url: z.string(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
});
type ClickHouseConfig = z.infer<typeof ClickHouseConfig>;

export class ClickHouseWebClient {
  private readonly client: ReturnType<typeof createClient>;

  constructor(url: string) {
    const config = this.parse(url);
    this.client = createClient({
      url: config.url,
      username: config.username,
      password: config.password,
      database: config.database,
    });
  }

  private parse(url: string): ClickHouseConfig {
    try {
      const parsed = new URL(url);
      return {
        url: `${parsed.protocol}//${parsed.host}`,
        username: parsed.username,
        password: parsed.password,
        database: 'default',
      };
    } catch (error) {
      throw new Error(`ClickHouse error: ${error}`);
    }
  }

  public async query<T>(params: QueryParams): Promise<ResultSet<T>> {
    return this.client.query(params);
  }

  public async ping(): Promise<PingResult> {
    return this.client.ping();
  }
}
