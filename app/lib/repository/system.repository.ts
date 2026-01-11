import { z } from "zod";
import { getClickHouseClient } from "@/lib/clickhouse/client";

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
  private async getTables(): Promise<Array<Table>> {
    const rows = await getClickHouseClient().query({
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
  }

  private async getColumns(table: string): Promise<Array<Column>> {
    const rows = await getClickHouseClient().query({
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
  }

  public async loadSchema(): Promise<Schema[]> {
    const tables = await this.getTables();
    const schema: Schema[] = [];

    for (const table of tables) {
      const columns = await this.getColumns(table.name);
      schema.push({
        table: table.name,
        columns: columns.map(col => col.name),
      });
    }

    return schema;
  }
}
