import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(error: unknown, status = 500): NextResponse {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "Something went wrong";
  return NextResponse.json({ success: false, message }, { status });
}
