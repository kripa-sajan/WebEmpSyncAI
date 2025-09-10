import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest,
  context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; 

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const companyId = req.headers.get("x-company-id");

    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (!companyId) return NextResponse.json({ success: false, message: "X-Company-ID header missing" }, { status: 400 });

    const res = await fetch(`${process.env.API_URL}/get-biometric-device/1`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "X-Company-ID": companyId,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("Error fetching device:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest,
  context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; 

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const body = await req.json();

    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (!body.company_id) return NextResponse.json({ success: false, message: "company_id is required" }, { status: 400 });

    const res = await fetch(`${process.env.API_URL}/biometric-device/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Company-ID": body.company_id.toString(),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("Error updating device:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest,
  context: { params: Promise<{ id: string }> }) {
 const { id } = await context.params; 

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const body = await req.json();

    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (!body.company_id) return NextResponse.json({ success: false, message: "company_id is required" }, { status: 400 });

    const res = await fetch(`${process.env.API_URL}/biometric-device/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Company-ID": body.company_id.toString(),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("Error deleting device:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
