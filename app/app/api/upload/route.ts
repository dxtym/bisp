import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { sanitizeSheetName } from "@/lib/sqlite/client";
import { BlobFile, Schema } from "@/lib/repository/common";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
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
      const columns = (rows[0] ?? []).map(String);
      const { url } = await put(`${fileId}/${safeName}.csv`, csv, {
        access: "public",
        contentType: "text/csv",
      });
      blobs.push({ name: safeName, url });
      schema.push({ table: safeName, columns });
    }

    return NextResponse.json({
      success: true,
      fileId,
      fileName: file.name,
      schema,
      blobs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
