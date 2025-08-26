"use client";

import { useState } from "react";

export default function ReportPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ start_date: "", end_date: "" });

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
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

  const downloadPDF = () => {
    if (!filters.start_date || !filters.end_date) {
      alert("Please select both Start Date and End Date");
      return;
    }

    window.open(
      `/api/report/punch?start_date=${filters.start_date}&end_date=${filters.end_date}`,
      "_blank"
    );
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
        <button onClick={fetchReport} className="bg-blue-500 text-white px-4 py-2 rounded">
          Fetch Report
        </button>
        <button onClick={downloadPDF} className="bg-green-500 text-white px-4 py-2 rounded">
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
