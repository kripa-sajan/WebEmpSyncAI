import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { company_id } = await req.json();
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
        // Stop and return what we have, or handle error differently
        break;
      }

      const responseData = await res.json();
      const usersOnPage = responseData.data;

      if (!Array.isArray(usersOnPage) || usersOnPage.length === 0) {
        // No more users, break the loop
        break;
      }

      allUsers.push(...usersOnPage);

      // Check if we've reached the last page
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
