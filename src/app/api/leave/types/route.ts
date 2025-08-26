import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_URL; // Django backend base URL

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const companyId = req.headers.get("x-company-id");

  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  if (!companyId) return NextResponse.json({ success: false, message: "Missing X-Company-ID header" }, { status: 400 });

  const res = await fetch(`${API_BASE_URL}/get_leave_types/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Company-ID": companyId,
    },
  });

  if (!res.ok) return NextResponse.json({ success: false, message: "Failed to fetch leave types" }, { status: res.status });

  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const companyId = req.headers.get("x-company-id");

  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  if (!companyId) return NextResponse.json({ success: false, message: "Missing X-Company-ID header" }, { status: 400 });

  const res = await fetch(`${API_BASE_URL}/get_leave_types/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Company-ID": companyId,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const companyId = req.headers.get("x-company-id");

  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  if (!companyId) return NextResponse.json({ success: false, message: "Missing X-Company-ID header" }, { status: 400 });

  const res = await fetch(`${API_BASE_URL}/get_leave_types/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Company-ID": companyId,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const companyId = req.headers.get("x-company-id");

  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  if (!companyId) return NextResponse.json({ success: false, message: "Missing X-Company-ID header" }, { status: 400 });

  const res = await fetch(`${API_BASE_URL}/get_leave_types/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Company-ID": companyId,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
