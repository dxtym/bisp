import { DbClient, DbType, ISystemRepository, detectDbType } from "@/lib/db/types";
import { ClickHouseWebClient } from "@/lib/clickhouse/client";
import { PostgresClient } from "@/lib/postgres/client";
import { ClickHouseSystemRepository } from "@/lib/repository/clickhouse/system";
import { PostgresSystemRepository } from "@/lib/repository/postgres/system";

export { detectDbType };

export function createDbClient(url: string): DbClient {
  const type = detectDbType(url);
  if (type === "postgres") {
    return new PostgresClient(url);
  }
  return new ClickHouseWebClient(url);
}

export function createSystemRepository(
  client: DbClient,
  type: DbType
): ISystemRepository {
  switch (type) {
    case "postgres":
      return new PostgresSystemRepository(client as PostgresClient);
    default:
      return new ClickHouseSystemRepository(client as ClickHouseWebClient);
  }
}
