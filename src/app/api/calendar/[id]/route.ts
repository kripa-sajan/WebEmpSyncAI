/*import { NextResponse } from "next/server";
import { cookies } from "next/headers";

interface Params {
  params: { id: string };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const companyId = cookieStore.get("company_id")?.value; // dynamic per logged-in user

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = params.id; // dynamic ID from URL
    const body = await req.json(); // expects { date: 'YYYY-MM', company_id?: 'x' }

    // build backend URL
    const apiUrl = `${process.env.API_URL}/get-calendar/${id}`;
    console.log("👉 Fetching:", apiUrl, "with body:", body);

    // always forward companyId from cookie if available
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(companyId ? { "X-Company-ID": companyId } : {}), // only include if exists
      },
      body: JSON.stringify({
        ...body,
        company_id: body.company_id || companyId, // prefer body → fallback to cookie
      }),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { success: false, message: text || "Unexpected error from backend" },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Error fetching calendar:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch calendar" },
      { status: 500 }
    );
  }
}
*/
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // 👈 must await here

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

    const apiUrl = `${process.env.API_URL}/get-calendar/${id}`;
    console.log("👉 Fetching:", apiUrl, "with body:", body);

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(companyId ? { "X-Company-ID": companyId } : {}),
      },
      body: JSON.stringify({
        ...body,
        company_id: body.company_id || companyId,
      }),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { success: false, message: text || "Unexpected error from backend" },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Error fetching calendar:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch calendar" },
      { status: 500 }
    );
  }
}
