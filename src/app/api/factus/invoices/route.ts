import { NextResponse } from "next/server";
import { listInvoices } from "@/lib/factus";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const data = await listInvoices(page);
    return NextResponse.json({ success: true, ...data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error listando facturas";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
