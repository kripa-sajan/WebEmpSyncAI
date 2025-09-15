import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const cookieCompanyId = cookieStore.get("company_id")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      company_id: bodyCompanyId,
      biometric_id: bodyBiometricId,
      start_date,
      end_date,
      page,
      today,
    } = body;

    // ✅ Determine company
    const company_id = bodyCompanyId || cookieCompanyId;
    if (!company_id) {
      return NextResponse.json({ error: "Missing company_id" }, { status: 400 });
    }

    // ✅ Ensure biometric_id exists
    let biometric_id = bodyBiometricId;
    if (!biometric_id) {
      const detailsRes = await fetch(
        `${process.env.API_URL}/user-details?company_id=${company_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!detailsRes.ok) {
        const errText = await detailsRes.text();
        return NextResponse.json(
          { error: "Failed to fetch user details", details: errText },
          { status: 500 }
        );
      }

      const details = await detailsRes.json();
      biometric_id = details.biometric_id;
    }

    if (!biometric_id) {
      return NextResponse.json(
        { error: "Missing biometric_id" },
        { status: 400 }
      );
    }

    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      return NextResponse.json({ error: "Missing API_URL" }, { status: 500 });
    }

    // ✅ Build Django endpoint & payload
    let fetchUrl = "";
    const payload: any = { company_id, biometric_id };

    if (today) {
      fetchUrl = `${apiUrl}/punch/today`;
      if (start_date && end_date) {
        payload.start_date = start_date;
        payload.end_date = end_date;
      }
    } else {
      if (!start_date || !end_date) {
        return NextResponse.json(
          { error: "Missing start_date or end_date" },
          { status: 400 }
        );
      }
      fetchUrl = `${apiUrl}/punch/${page || 1}`;
      payload.start_date = start_date;
      payload.end_date = end_date;
    }

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
