import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const cookieCompanyId = cookieStore.get("company_id")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      company_id: bodyCompanyId,
      biometric_id,
      start_date,
      end_date,
      page,
      today,
    } = body;

    // ✅ Determine company
    const company_id = bodyCompanyId || cookieCompanyId;
    if (!company_id) {
      return NextResponse.json(
        { success: false, message: "Missing company_id" },
        { status: 400 }
      );
    }

    // ✅ Require biometric_id in body
    if (!biometric_id) {
      return NextResponse.json(
        { success: false, message: "Missing biometric_id" },
        { status: 400 }
      );
    }

    // ✅ Build Django endpoint & payload
    let fetchUrl = "";
    const payload: any = { company_id, biometric_id };

    if (today) {
      fetchUrl = `${process.env.API_URL}/punch/today`;
      if (start_date && end_date) {
        payload.start_date = start_date;
        payload.end_date = end_date;
      }
    } else {
      if (!start_date || !end_date) {
        return NextResponse.json(
          { success: false, message: "Missing start_date or end_date" },
          { status: 400 }
        );
      }
      fetchUrl = `${process.env.API_URL}/punch/${page || 1}`;
      payload.start_date = start_date;
      payload.end_date = end_date;
    }

    const res = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Company-ID": company_id.toString(),
      },
      body: JSON.stringify(payload),
    });

   // ✅ Normalize response before returning
const responseData = await res.json()

if (!res.ok) {
  console.error("Error fetching attendance:", responseData)
  return NextResponse.json(responseData, { status: res.status })
}

// Ensure data is always an array
let records: any[] = []

if (Array.isArray(responseData)) {
  records = responseData
} else if (Array.isArray(responseData.data)) {
  records = responseData.data
} else if (responseData.data) {
  records = [responseData.data]   // single object → wrap in array
} else {
  records = []
}

return NextResponse.json(
  { success: true, data: records },
  { status: 200 }

)

  } catch (err) {
    console.error("Attendance API error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
