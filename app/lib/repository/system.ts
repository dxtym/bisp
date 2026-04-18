import type { Column, Schema, Table } from "@/lib/repository/common";
import type { ISystemRepository } from "@/lib/db/types";

export abstract class BaseSystemRepository implements ISystemRepository {
  protected abstract getTables(): Promise<Table[]>;
  protected abstract getColumns(table: string): Promise<Column[]>;

  public async loadSchema(): Promise<Schema[]> {
    try {
      const tables = await this.getTables();
      const schema: Schema[] = [];
      for (const table of tables) {
        const columns = await this.getColumns(table.name);
        schema.push({ table: table.name, columns });
      }
      return schema;
    } catch (error) {
      throw new Error(`Load schema error: ${error}`);
    }
  }
}
