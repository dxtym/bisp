import { PostgresClient } from "@/lib/postgres/client";
import { ISystemRepository } from "@/lib/db/types";
import { Table, Column, Schema } from "@/lib/repository/common";

export class PostgresSystemRepository implements ISystemRepository {
  private readonly client: PostgresClient;

  constructor(client: PostgresClient) {
    this.client = client;
  }

  private async getTables(): Promise<Table[]> {
    try {
      const rows = await this.client.executeQuery(`
        SELECT table_name AS name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
      `);
      return rows as Table[];
    } catch (error) {
      throw new Error(`Get tables error: ${error}`);
    }
  }

  private async getColumns(table: string): Promise<Column[]> {
    try {
      const rows = await this.client.executeQuery(
        `
        SELECT column_name AS name, data_type AS type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
      `,
        [table],
      );
      return rows as Column[];
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
          columns: columns.map((col) => col.name),
        });
      }

      return schema;
    } catch (error) {
      throw new Error(`Load schema error: ${error}`);
    }
  }
}
