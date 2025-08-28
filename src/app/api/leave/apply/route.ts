// app/api/leave/apply/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
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

    // Call Django API
    const res = await fetch(`${process.env.API_URL}/apply-leave`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Company-ID": body.company_id || "7", // Pass company ID dynamically
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        leave_type: body.leave_type,
        short_name: body.short_name,
        monthly_limit: body.monthly_limit,
        yearly_limit: body.yearly_limit,
        initial_credit: body.initial_credit,
        use_credit: body.use_credit,
        allow_carry_forward: body.allow_carry_forward,
      }),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Error in /leave/apply:", err);
    return NextResponse.json(
      { success: false, message: "Failed to apply leave" },
      { status: 500 }
    );
  }
}
