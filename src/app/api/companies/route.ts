// app/api/auth/user-companies/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function GET() {
  try {

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Call the external API with Bearer token
    const res = await fetch(`${process.env.API_URL}/user-companies`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error proxying /user-companies:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user companies" },
      { status: 500 }
    );
  }
}
