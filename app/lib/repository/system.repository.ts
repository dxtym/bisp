import { z } from "zod";
import clickhouseClient from "@/lib/clickhouse/client";

const Table = z.object({
  name: z.string(),
})
export type Table = z.infer<typeof Table>;

const Column = z.object({
  name: z.string(),
  type: z.string(),
})
export type Column = z.infer<typeof Column>;

export class SystemRepository {
  public async getTables(): Promise<Array<Table>> {
    const rows = await clickhouseClient.query({
      query: `
        SELECT name
        FROM system.tables
        WHERE database = currentDatabase()
        SETTINGS use_query_cache = 0;
      `,
      format: "JSONEachRow",
    })

    const tables: Array<Table> = [];
    for await (const row of rows.stream()) {
      row.forEach(r => {
        tables.push(r.json() as Table);
      })
    }

    return tables;
  }

  public async getColumns(table: string): Promise<Array<Column>> {
    const rows = await clickhouseClient.query({
      query: `
        SELECT name, type
        FROM system.columns
        WHERE
            database = currentDatabase()
            AND table = ${table}
        SETTINGS use_query_cache = 0;
      `,
      format: "JSONEachRow",
    })

    const columns: Array<Column> = [];
    for await (const row of rows.stream()) {
      row.forEach(r => {
        columns.push(r.json() as Column);
      })
    }

    return columns;
  }
}
