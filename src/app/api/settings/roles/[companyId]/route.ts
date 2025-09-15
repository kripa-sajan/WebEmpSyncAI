import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  const { companyId } = await  params;

  // 🔐 grab token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(
      `${process.env.API_URL}/role/${companyId}`, // hit backend
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // use cookie token
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch Roles");
    }

    const data = await res.json();
const rolesArray = data.data || data || [];
return NextResponse.json(rolesArray);

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
