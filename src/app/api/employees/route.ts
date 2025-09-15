import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Safe parse body, fallback to cookie if empty
    const body = await req.json().catch(() => ({}));
    const company_id = body.company_id || cookieStore.get("company_id")?.value;

    if (!company_id) {
      return NextResponse.json({ error: "Missing company_id" }, { status: 400 });
    }

    let page = 1;
    let allUsers: any[] = [];
    const apiUrl = process.env.API_URL;

    while (true) {
      const fetchUrl = `${apiUrl}/admin/users/${page}`;
      const res = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ company_id }),
        cache: "no-store",
      });

      if (!res.ok) {
        console.error(`Failed to fetch page ${page}. Status: ${res.status}`);
        break;
      }

      const responseData = await res.json();
      const usersOnPage = responseData.data;

      if (!Array.isArray(usersOnPage) || usersOnPage.length === 0) {
        break;
      }

      allUsers.push(...usersOnPage);

      if (page >= responseData.total_page) {
        break;
      }

      page++;
    }

    return NextResponse.json(allUsers);
  } catch (err) {
    console.error("Users API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
