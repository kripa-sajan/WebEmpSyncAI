import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const companyId = req.headers.get("x-company-id");

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (!companyId) {
      return NextResponse.json({ success: false, message: "X-Company-ID header missing" }, { status: 400 });
    }

    const apiUrl = `${process.env.API_URL}/virtual-device/${page}`;
    console.log("👉 Fetching:", apiUrl);

    const res = await fetch(apiUrl, {
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
    console.error("Error fetching virtual devices:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
