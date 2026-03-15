import { Schema } from "@/lib/repository/common";

export type DbType = "clickhouse" | "postgres";

export interface DbClient {
  executeQuery(sql: string): Promise<Record<string, unknown>[]>;
  ping(): Promise<boolean>;
}

export interface ISystemRepository {
  loadSchema(): Promise<Schema[]>;
}
