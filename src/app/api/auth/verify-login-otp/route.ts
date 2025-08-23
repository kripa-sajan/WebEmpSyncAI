import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    
    const api_url = `${process.env.API_URL}/verify-login-otp`;

    const res = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    console.log("Received response from external API. Status:", res.status);
    console.log("External API response body:", JSON.stringify(data, null, 2));

    if (!res.ok) {
      console.error("External API returned an error.");
      return NextResponse.json({ error: data?.message || "Verification failed", details: data }, { status: res.status });
    }

    const response = NextResponse.json({ data, success: true });
    
    return response;
  } catch (err) {
    console.error("Error in /api/auth/verify-login-otp:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
