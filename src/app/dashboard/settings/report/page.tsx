"use client";

import { useState } from "react";

export default function ReportPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ start_date: "", end_date: "" });

  // Fetch Punch Report (POST)
  const fetchReport = async () => {
    if (!filters.start_date || !filters.end_date) {
      alert("Please select both From Date and To Date");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/report/punch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: 7,
          from_date: filters.start_date,
          to_date: filters.end_date,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", res.status, errorText);
        throw new Error("Failed to fetch report");
      }

      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      console.error("Fetch Report Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Punch Report</h1>

      {/* <div className="flex gap-2 mb-4">
        <input
          type="date"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, start_date: e.target.value })
          }
        />
        <input
          type="date"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, end_date: e.target.value })
          }
        / */}
        <div className="flex gap-2 mb-4 items-end">
  <div>
    <label htmlFor="start_date" className="block text-sm font-medium mb-1">
      From Date
    </label>
    <input
      id="start_date"
      type="date"
      className="border p-2 rounded"
      onChange={(e) =>
        setFilters({ ...filters, start_date: e.target.value })
      }
    />
  </div>

  <div>
    <label htmlFor="end_date" className="block text-sm font-medium mb-1">
      To Date
    </label>
    <input
      id="end_date"
      type="date"
      className="border p-2 rounded"
      onChange={(e) =>
        setFilters({ ...filters, end_date: e.target.value })
      }
    />
  </div>

  <button
    onClick={fetchReport}
    className="bg-blue-500 text-white px-4 py-2 rounded h-[42px]"
  >
    Fetch Report
  </button>
</div>

        <button
          onClick={fetchReport}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Fetch Report
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <table className="border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border p-2">User</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Time In</th>
            <th className="border p-2">Time Out</th>
          </tr>
        </thead>
        <tbody>
          {data.map((punch: any, idx) => (
            <tr key={idx}>
              <td className="border p-2">{punch.user}</td>
              <td className="border p-2">{punch.date}</td>
              <td className="border p-2">{punch.time_in}</td>
              <td className="border p-2">{punch.time_out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/*"use client";

import { useState } from "react";

export default function ReportPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ start_date: "", end_date: "" });


  // Fetch Punch Report (POST)
  const fetchReport = async () => {
    if (!filters.start_date || !filters.end_date) {
      alert("Please select both From Date and To Date");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/report/punch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: 7, // Add company_id required by your API
          from_date: filters.start_date,
          to_date: filters.end_date,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch report");

      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      console.error("Fetch Report Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Punch Report</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="date"
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
        />
        <button
          onClick={fetchReport}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Fetch Report
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <table className="border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border p-2">User</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Time In</th>
            <th className="border p-2">Time Out</th>
          </tr>
        </thead>
        <tbody>
          {data.map((punch: any, idx) => (
            <tr key={idx}>
              <td className="border p-2">{punch.user}</td>
              <td className="border p-2">{punch.date}</td>
              <td className="border p-2">{punch.time_in}</td>
              <td className="border p-2">{punch.time_out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}*/
/*"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ReportPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ start_date: "", end_date: "" });

  // Fetch Punch Report (POST)
  const fetchReport = async () => {
    if (!filters.start_date || !filters.end_date) {
      alert("Please select both From Date and To Date");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/report/punch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: 1,
          from_date: filters.start_date,
          to_date: filters.end_date,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch report");

      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      console.error("Fetch Report Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Download PDF Function
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Punch Report", 14, 15);

    doc.setFontSize(12);
    doc.text(`From: ${filters.start_date}  To: ${filters.end_date}`, 14, 25);

    (doc as any).autoTable({
      startY: 35,
      head: [["User", "Date", "Time In", "Time Out"]],
      body: data.map((punch: any) => [
        punch.user,
        punch.date,
        punch.time_in,
        punch.time_out,
      ]),
    });

    doc.save("punch_report.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Punch Report</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="date"
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
        />
        <button
          onClick={fetchReport}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Fetch Report
        </button>
        <button
          onClick={downloadPDF}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={data.length === 0}
        >
          Download PDF
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <table className="border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border p-2">User</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Time In</th>
            <th className="border p-2">Time Out</th>
          </tr>
        </thead>
        <tbody>
          {data.map((punch: any, idx) => (
            <tr key={idx}>
              <td className="border p-2">{punch.user}</td>
              <td className="border p-2">{punch.date}</td>
              <td className="border p-2">{punch.time_in}</td>
              <td className="border p-2">{punch.time_out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
*/
