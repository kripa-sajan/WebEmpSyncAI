import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// POST: Add a biometric device
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body.device_id) {
      return NextResponse.json(
        { success: false, message: "device_id is required" },
        { status: 400 }
      );
    }

    if (!body.company_id) {
      return NextResponse.json(
        { success: false, message: "company_id is required" },
        { status: 400 }
      );
    }

    // Call your Django backend
    const res = await fetch(`${process.env.API_URL}/add-biometric-device`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("Error adding biometric device:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
