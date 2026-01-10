import { z } from "zod";
import { createClient, QueryParams, ResultSet } from "@clickhouse/client";

const ClickHouseConfig = z.object({
  url: z.string(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
});
type ClickHouseConfig = z.infer<typeof ClickHouseConfig>;

class ClickHouseClient {
  private readonly client: ReturnType<typeof createClient>;

  constructor(config: ClickHouseConfig) {
    this.client = createClient({
      url: config.url,
      username: config.username,
      password: config.password,
      database: config.database,
    })
  }

  public async query<T>(params: QueryParams): Promise<ResultSet<T>> {
    return this.client.query(params);
  }
}

const clickhouseClient = new ClickHouseClient({
  url: process.env.CLICKHOUSE_URL!,
  username: process.env.CLICKHOUSE_USER!,
  password: process.env.CLICKHOUSE_PASSWORD!,
  database: process.env.CLICKHOUSE_DATABASE!
});

export default clickhouseClient;
