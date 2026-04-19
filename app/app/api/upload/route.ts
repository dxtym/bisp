import * as XLSX from "xlsx";
import { put } from "@vercel/blob";
import { sanitizeSheetName } from "@/lib/sqlite/client";
import { BlobFile, Schema } from "@/lib/repository/common";
import { ok, fail } from "@/lib/api/response";
import { requireAuth } from "@/lib/api/auth";

export async function POST(req: Request) {
  try {
    const sessionOrResponse = await requireAuth();
    if (sessionOrResponse instanceof Response) return sessionOrResponse;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return fail("No file provided", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const fileId = crypto.randomUUID();
    const blobs: BlobFile[] = [];
    const schema: Schema[] = [];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      const safeName = sanitizeSheetName(sheetName);
      const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
      const columns = (rows[0] ?? []).map((col) => ({ name: String(col), type: "TEXT" }));
      const { url } = await put(`${fileId}/${safeName}.csv`, csv, {
        access: "public",
        contentType: "text/csv",
      });
      blobs.push({ name: safeName, url });
      schema.push({ table: safeName, columns });
    }

    return ok({ fileId, fileName: file.name, schema, blobs });
  } catch (error) {
    return fail(error, 500);
  }
}
