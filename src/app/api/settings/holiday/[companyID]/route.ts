import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET: Fetch holidays for a company
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ companyID: string }> }
) {
  const { companyID } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${process.env.API_URL}/holiday`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "X-Company-ID": companyID,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST: Add a holiday
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ companyID: string }>  }
) {
  const { companyID } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    body.company_id = companyID;

    const res = await fetch(`${process.env.API_URL}/add-holiday`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Company-ID": companyID,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PUT: Update a holiday
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ companyID: string }> }
) {
  const { companyID } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    body.company_id = companyID;

    const res = await fetch(`${process.env.API_URL}/update-holiday`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Company-ID": companyID,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE: Remove a holiday
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ companyID: string }> }
) {
 const { companyID } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    body.company_id = companyID;

    const res = await fetch(`${process.env.API_URL}/holiday`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Company-ID": companyID,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
