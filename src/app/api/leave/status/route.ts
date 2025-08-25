import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const companyId = req.headers.get("X-Company-ID");
  const token = req.headers.get("Authorization") || "";

  const res = await fetch(`${process.env.BACKEND_URL}/get_requested_leaves/1`, {
    headers: {
      Authorization: token,
      "X-Company-ID": companyId || "",
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
