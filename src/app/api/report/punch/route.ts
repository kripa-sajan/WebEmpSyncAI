/*// app/api/report/punch/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { start_date, end_date } = body;

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${process.env.API_URL}/punchreport`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_id: 7,
        from_date: start_date,
        to_date: end_date,
      }),
    });

    const text = await res.text(); // first read as text
    let data;

    try {
      data = JSON.parse(text); // try parsing JSON
    } catch {
      console.error("Invalid JSON from backend:", text);
      return NextResponse.json({ success: false, message: "Invalid response from backend" }, { status: 500 });
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Error in /punchreport:", err);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

/*import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(`${process.env.API_URL}/api/punchreport`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) return NextResponse.json(data, { status: res.status });

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error in /api/report/punch:", err);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
*/
/*import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { company_id, from_date, to_date } = body;

    // Validate input
    if (!company_id || !from_date || !to_date) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Example data (replace with DB fetch or Django API call)
    const reportData = [
      { user: "John Doe", date: from_date, time_in: "09:00", time_out: "17:00" },
      { user: "Jane Smith", date: to_date, time_in: "10:00", time_out: "18:00" },
    ];

    return NextResponse.json({ success: true, data: reportData });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}*/
// app/api/report/punch/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();  // 👈 await here
    const token = cookieStore.get("access_token")?.value;
    const companyId = cookieStore.get("company_id")?.value;


    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { company_id, from_date, to_date } = body;

    if (!company_id || !from_date || !to_date) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call Django API
    const res = await fetch(`${process.env.API_URL}/punchreport`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        company_id,
        from_date,
        to_date,
      }),
    });

    // read and return response
    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("Invalid JSON from backend:", text);
      return NextResponse.json(
        { success: false, message: "Invalid response from backend" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Error in /report/punch:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
