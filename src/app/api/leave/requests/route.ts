/*import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const companyId = req.headers.get("X-Company-ID");
  const token = req.headers.get("Authorization") || "";

  const res = await fetch(`${process.env.API_URL}/get_requested_leaves/1`, {
    headers: {
      Authorization: token,
      "X-Company-ID": companyId || "",
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}*/
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_URL;

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const companyId = req.headers.get("x-company-id");
  const url = new URL(req.url);
  const page = url.searchParams.get("page") || "1";

  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  if (!companyId) return NextResponse.json({ success: false, message: "Missing X-Company-ID header" }, { status: 400 });

  const res = await fetch(`${API_BASE_URL}/get_requested_leaves/${page}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Company-ID": companyId,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

