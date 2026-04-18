import { ClickHouseWebClient } from "@/lib/clickhouse/client";
import type { Column, Table } from "@/lib/repository/common";
import { BaseSystemRepository } from "@/lib/repository/system";

export class ClickHouseSystemRepository extends BaseSystemRepository {
  constructor(private readonly client: ClickHouseWebClient) {
    super();
  }

  protected async getTables(): Promise<Table[]> {
    try {
      const rows = await this.client.query({
        query: `
          SELECT name
          FROM system.tables
          WHERE database = currentDatabase()
          SETTINGS use_query_cache = 0;
        `,
        format: "JSONEachRow",
      });
      return (await rows.json()) as Table[];
    } catch (error) {
      throw new Error(`Get tables error: ${error}`);
    }
  }

  protected async getColumns(table: string): Promise<Column[]> {
    try {
      const rows = await this.client.query({
        query: `
          SELECT name, type
          FROM system.columns
          WHERE database = currentDatabase()
            AND table = {table:String}
          SETTINGS use_query_cache = 0;
        `,
        query_params: { table },
        format: "JSONEachRow",
      });
      return (await rows.json()) as Column[];
    } catch (error) {
      throw new Error(`Get columns error: ${error}`);
    }
  }
}
