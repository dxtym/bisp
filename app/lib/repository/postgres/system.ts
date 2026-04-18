import { PostgresClient } from "@/lib/postgres/client";
import type { Column, Table } from "@/lib/repository/common";
import { BaseSystemRepository } from "@/lib/repository/system";

export class PostgresSystemRepository extends BaseSystemRepository {
  constructor(private readonly client: PostgresClient) {
    super();
  }

  protected async getTables(): Promise<Table[]> {
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

  protected async getColumns(table: string): Promise<Column[]> {
    try {
      const rows = await this.client.executeParameterized(
        `SELECT column_name AS name, data_type AS type
         FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = $1`,
        [table]
      );
      return rows as Column[];
    } catch (error) {
      throw new Error(`Get columns error: ${error}`);
    }
  }
}
