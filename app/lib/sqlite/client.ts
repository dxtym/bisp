import { Database } from "bun:sqlite";
import * as XLSX from "xlsx";
import { Schema, BlobFile } from "@/lib/repository/common";

export function sanitizeSheetName(name: string): string {
  const sanitized = name.replace(/[^a-zA-Z0-9_]/g, "_");
  return /^[0-9]/.test(sanitized) ? `_${sanitized}` : sanitized;
}

async function parseCsvFromUrl(url: string): Promise<string[][]> {
  const csv = await fetch(url).then((r) => r.text());
  const wb = XLSX.read(csv, { type: "string" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
}

export async function loadSchemaFromUrls(blobs: BlobFile[]): Promise<Schema[]> {
  return Promise.all(
    blobs.map(async ({ name, url }) => {
      const rows = await parseCsvFromUrl(url);
      const columns = (rows[0] ?? []).map((col) => ({ name: String(col), type: "TEXT" }));
      return { table: name, columns };
    })
  );
}

export async function executeQueryFromUrls(
  sql: string,
  blobs: BlobFile[]
): Promise<Record<string, unknown>[]> {
  const parsed = await Promise.all(
    blobs.map(async ({ name, url }) => ({ name, rows: await parseCsvFromUrl(url) }))
  );
  const db = new Database(":memory:");
  try {
    for (const { name, rows } of parsed) {
      if (rows.length === 0) continue;
      const headers = rows[0].map(String);
      const cols = headers.map((h) => `"${h.replace(/"/g, '""')}" TEXT`).join(", ");
      db.exec(`CREATE TABLE "${name}" (${cols})`);
      const insert = db.prepare(
        `INSERT INTO "${name}" VALUES (${headers.map(() => "?").join(", ")})`
      );
      const insertMany = db.transaction((dataRows: string[][]) => {
        for (const row of dataRows) {
          insert.run(...headers.map((_, i) => String(row[i] ?? "")));
        }
      });
      insertMany(rows.slice(1) as string[][]);
    }
    return db.prepare(sql).all() as Record<string, unknown>[];
  } finally {
    db.close();
  }
}
