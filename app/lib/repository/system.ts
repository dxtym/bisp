import { z } from "zod";

import { ClickHouseWebClient } from "../../lib/clickhouse/client";

const Table = z.object({
  name: z.string(),
})
export type Table = z.infer<typeof Table>;

const Column = z.object({
  name: z.string(),
  type: z.string(),
})
export type Column = z.infer<typeof Column>;

const Schema = z.object({
  table: z.string(),
  columns: z.array(z.string()),
})
export type Schema = z.infer<typeof Schema>;

export class SystemRepository {
  private readonly client: ClickHouseWebClient;

  constructor(client: ClickHouseWebClient) {
    this.client = client;
  }

  private async getTables(): Promise<Table[]> {
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

      const data = await rows.json();
      return data as Table[];
    } catch (error) {
      throw new Error(`Get tables error: ${error}`);
    }
  }

  private async getColumns(table: string): Promise<Column[]> {
    try {
      const rows = await this.client.query({
        query: `
          SELECT name, type
          FROM system.columns
          WHERE
              database = currentDatabase()
              AND table = {table:String}
          SETTINGS use_query_cache = 0;
        `,
        query_params: {
          table: table,
        },
        format: "JSONEachRow",
      });

      const data = await rows.json();
      return data as Column[];
    } catch (error) {
      throw new Error(`Get columns error: ${error}`);
    }
  }

  public async loadSchema(): Promise<Schema[]> {
    try {
      const schema: Schema[] = [];
      const tables = await this.getTables();

      for (const table of tables) {
        const columns = await this.getColumns(table.name);
        schema.push({
          table: table.name,
          columns: columns.map(col => col.name),
        });
      }

      return schema;
    } catch (error) {
      throw new Error(`Load schema error: ${error}`);
    }
  }
}
