import { Schema } from "@/lib/repository/common";

export type DbType = "clickhouse" | "postgres";

export function detectDbType(url: string): DbType {
  const lower = url.toLowerCase();
  if (lower.startsWith("postgres://") || lower.startsWith("postgresql://")) {
    return "postgres";
  }
  return "clickhouse";
}

export interface DbClient {
  executeQuery(sql: string): Promise<Record<string, unknown>[]>;
  ping(): Promise<boolean>;
}

export interface ISystemRepository {
  loadSchema(): Promise<Schema[]>;
}
