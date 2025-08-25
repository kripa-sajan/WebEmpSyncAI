import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const start_date = searchParams.get("start_date") || "";
    const end_date = searchParams.get("end_date") || "";

    // Build URL without company_id
    const apiUrl = `http://127.0.0.1:8000/api/punchreport?download=pdf&start_date=${start_date}&end_date=${end_date}`;

    // Fetch PDF from Django API with proper Authorization
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN || ""}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to download PDF: ${errText}`);
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=punch_report.pdf",
      },
    });
  } catch (err: any) {
    console.error("PDF Download Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
