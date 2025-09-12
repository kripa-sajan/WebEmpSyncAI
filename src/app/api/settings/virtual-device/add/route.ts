import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const body = await req.json();

    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (!body.company_id) return NextResponse.json({ success: false, message: "company_id is required" }, { status: 400 });

    const apiUrl = `${process.env.API_URL}/add-virtual-device`;
    console.log("👉 Creating:", apiUrl);

    const res = await fetch(apiUrl, {
      method: "POST",
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
    console.error("Error creating virtual device:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
