/*// src/app/api/switch-company/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const { company_id } = body;

  if (!company_id) {
    return NextResponse.json({ success: false, message: "Company ID is required" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true, company_id });

  // Save company ID in cookie
  response.cookies.set("company_id", company_id, {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
  });

  return response;
}*/
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
  }

  const { company_id } = body;

  if (!company_id) {
    return NextResponse.json({ success: false, message: "Company ID is required" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true, company_id });

  // Save company ID in cookie
  response.cookies.set("company_id", company_id, {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
  });

  return response;
}

