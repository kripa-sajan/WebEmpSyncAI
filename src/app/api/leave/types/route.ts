import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL; // Backend URL from .env

// GET: Fetch Leave Types
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/get_leave_types`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Company-ID": "7",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch leave types" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT: Update Leave Type
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json(); // Extract request body (id, monthly_limit, yearly_limit)

    const res = await fetch(`${API_URL}/update_leave_type`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Company-ID": "7",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
