import { z } from "zod";
import { createClient, QueryParams, ResultSet } from "@clickhouse/client-web";

const ClickHouseConfig = z.object({
  url: z.string(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
});
type ClickHouseConfig = z.infer<typeof ClickHouseConfig>;

class ClickHouseWebClient {
  private readonly client: ReturnType<typeof createClient>;

  constructor(connectionString: string) {
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
      throw new Error(`Invalid connection string format: ${error}`);
    }
  }

  public async query<T>(params: QueryParams): Promise<ResultSet<T>> {
    return this.client.query(params);
  }
}

let client: ClickHouseWebClient | null = null;

export function createClickHouseClient(connectionString: string) {
  client = new ClickHouseWebClient(connectionString);
}

export function getClickHouseClient(): ClickHouseWebClient {
  if (!client) {
    throw new Error("ClickHouse client not created")
  }
  return client
}
