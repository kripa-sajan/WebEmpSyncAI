// app/api/leave/status/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const companyId = cookieStore.get("company_id")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Call the external Django API
    const res = await fetch(`${process.env.API_URL}/leave/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error proxying /leave/status:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update leave status" },
      { status: 500 }
    );
  }
}

