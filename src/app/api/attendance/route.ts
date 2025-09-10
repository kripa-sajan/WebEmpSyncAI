/*import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // ✅ Await cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const {
      company_id,
      biometric_id,
      user_id,
      start_date,
      end_date,
      page,
      today,
    } = body;

    if (!company_id || !biometric_id || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { error: "Missing API_URL in environment" },
        { status: 500 }
      );
    }

    // 🔹 Decide which Django endpoint to call
    let fetchUrl = "";
    const payload: any = { company_id, biometric_id, user_id };

    if (today) {
      fetchUrl = `${apiUrl}/punch/today`;
      if (start_date && end_date) {
        payload.start_date = start_date;
        payload.end_date = end_date;
      }
    } else {
      if (!start_date || !end_date) {
        return NextResponse.json(
          { error: "Missing start_date or end_date for historical punches" },
          { status: 400 }
        );
      }
      fetchUrl = `${apiUrl}/punch/${page || 1}`;
      payload.start_date = start_date;
      payload.end_date = end_date;
    }

    console.log("Calling Django API:", fetchUrl, payload);

    const res = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "",
        Authorization: `Bearer ${token}`,
        "X-Company-ID": company_id.toString(),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Punch API failed. Status: ${res.status}`, errorText);
      return NextResponse.json(
        { error: "Failed to fetch attendance", details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Attendance API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
  */import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { company_id, biometric_id, user_id, start_date, end_date, page, today } = body;

    if (!company_id || !biometric_id || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      return NextResponse.json({ error: "Missing API_URL in environment" }, { status: 500 });
    }

    // Decide which Django endpoint to call
    let fetchUrl = "";
    const payload: any = { company_id, biometric_id, user_id };

    if (today) {
      fetchUrl = `${apiUrl}/punch/today`;
      if (start_date && end_date) {
        payload.start_date = start_date;
        payload.end_date = end_date;
      }
    } else {
      if (!start_date || !end_date) {
        return NextResponse.json({ error: "Missing start_date or end_date for historical punches" }, { status: 400 });
      }
      fetchUrl = `${apiUrl}/punch/${page || 1}`;
      payload.start_date = start_date;
      payload.end_date = end_date;
    }

    console.log("Calling Django API:", fetchUrl, payload);

    const res = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "X-Company-ID": company_id.toString(),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Punch API failed. Status: ${res.status}`, errorText);
      return NextResponse.json({ error: "Failed to fetch attendance", details: errorText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Attendance API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
