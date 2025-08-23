import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    
    const res = await fetch(`${process.env.API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include", // backend may set cookies
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data?.message || "Login failed" }, { status: res.status });
    }

    // Example: set httpOnly cookie for production
    const response = NextResponse.json(data);
    const token = data.access_token|| data.token; // Adjust based on your API response
    response.cookies.set({
      name: "access_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
