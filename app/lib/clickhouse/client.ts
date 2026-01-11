import { z } from "zod";

import { createClient, QueryParams, ResultSet } from "@clickhouse/client-web";

const ClickHouseConfig = z.object({
  url: z.string(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
});
type ClickHouseConfig = z.infer<typeof ClickHouseConfig>;

export class ClickHouseWebClient {
  private static instance: ClickHouseWebClient;
  private readonly client: ReturnType<typeof createClient>;

  private constructor(connectionString: string) {
    const config = this.parse(connectionString);
    this.client = createClient({
      url: config.url,
      username: config.username,
      password: config.password,
      database: config.database,
    });
  }

  private parse(connectionString: string): ClickHouseConfig {
    try {
      const url = new URL(connectionString);
      return {
        url: `${url.protocol}//${url.host}`,
        username: url.username,
        password: url.password,
        database: url.pathname.slice(1),
      };
    } catch (error) {
      throw new Error(`ClickHouse error: ${error}`);
    }
  }

  public static getInstance(connectionString: string): ClickHouseWebClient {
    if (!ClickHouseWebClient.instance) {
      ClickHouseWebClient.instance = new ClickHouseWebClient(connectionString);
    }
    return ClickHouseWebClient.instance;
  }

  public async query<T>(params: QueryParams): Promise<ResultSet<T>> {
    return this.client.query(params);
  }
}
