import { createClient, QueryParams, ResultSet } from "@clickhouse/client";

type DbConfig = {
  url: string;
  username: string;
  password: string;
  database: string;
};

class DbClient {
  private readonly client: ReturnType<typeof createClient>;

  constructor(config: DbConfig) {
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

const db = new DbClient({
  url: "http://localhost:8123",
  username: "user",
  password: "password",
  database: "default",
});

export default db;
