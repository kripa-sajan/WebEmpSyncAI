"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "@/context/AuthContext";

interface DailyLog {
  date: string;
  check_ins: string[];
  check_outs: string[];
  working_hours: number;
}

interface UserRecord {
  name: string;
  daily_logs: DailyLog[];
}

export default function ReportPage() {
  const { company } = useAuth(); // ✅ get selected company
  const [data, setData] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ start_date: Date | null; end_date: Date | null }>({
    start_date: null,
    end_date: null,
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    try {
      return format(new Date(date), "yyyy-MM-dd");
    } catch {
      return String(date);
    }
  };

  // Fetch Punch Report
  const fetchReport = async () => {
    if (!filters.start_date || !filters.end_date) {
      alert("Please select From Date and To Date");
      return;
    }

    if (!company) {
      alert("No company selected");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/report/punch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_date: formatDate(filters.start_date),
          to_date: formatDate(filters.end_date),
          company_id: company.id, // ✅ send selected company
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch report");

      const result = await res.json();
      setData(result.records || []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch report whenever company changes
  useEffect(() => {
    if (company && filters.start_date && filters.end_date) {
      fetchReport();
    }
  }, [company]);

  // Download PDF
  const downloadPDF = () => {
    if (!data.length) {
      alert("No data to download");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Punch Report", 14, 15);
    doc.setFontSize(12);
    doc.text(
      `From: ${formatDate(filters.start_date)}  To: ${formatDate(filters.end_date)}`,
      14,
      25
    );

    autoTable(doc, {
      startY: 35,
      head: [["User", "Date", "Check-Ins", "Check-Outs", "Working Hours"]],
      body: data.flatMap(user =>
        (user.daily_logs || []).map(log => [
          user.name || "N/A",
          log.date || "-",
          (log.check_ins || []).join(", "),
          (log.check_outs || []).join(", "),
          log.working_hours || "-",
        ])
      ),
    });

    doc.save("punch_report.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Punch Report</h1>

      <div className="flex gap-2 mb-4 items-center">
        <DatePicker
          selected={filters.start_date}
          onChange={(date) => setFilters({ ...filters, start_date: date })}
          dateFormat="yyyy-MM-dd"
          placeholderText="From Date"
          className="border p-2 rounded"
        />
        <DatePicker
          selected={filters.end_date}
          onChange={(date) => setFilters({ ...filters, end_date: date })}
          dateFormat="yyyy-MM-dd"
          placeholderText="To Date"
          className="border p-2 rounded"
        />
        <button
          onClick={fetchReport}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Report"}
        </button>
        <button
          onClick={downloadPDF}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={data.length === 0}
        >
          Download PDF
        </button>
      </div>

      {!loading && data.length === 0 && (
        <p className="text-gray-500">No records found</p>
      )}

      {data.length > 0 && (
        <div className="overflow-auto max-h-[60vh] border">
          <table className="border-collapse border border-gray-400 w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="border p-2">User</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Check-Ins</th>
                <th className="border p-2">Check-Outs</th>
                <th className="border p-2">Working Hours</th>
              </tr>
            </thead>
            <tbody>
              {data.flatMap((user, idx) =>
                user.daily_logs.map((log, logIdx) => (
                  <tr key={`${idx}-${logIdx}`}>
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{log.date}</td>
                    <td className="border p-2">{(log.check_ins || []).join(", ")}</td>
                    <td className="border p-2">{(log.check_outs || []).join(", ")}</td>
                    <td className="border p-2">{log.working_hours || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



/*"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ReportPage() {
  const [data, setData] = useState<any[]>([]);
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
          company_id: 7, // adjust as per your API
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
          value={filters.start_date}
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
        />
        <input
          type="date"
          value={filters.end_date}
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
      {!loading && data.length === 0 && (
        <p className="text-gray-500">No records found</p>
      )}

      {data.length > 0 && (
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
            {data.map((punch, idx) => (
              <tr key={idx}>
                <td className="border p-2">{punch.user}</td>
                <td className="border p-2">{punch.date}</td>
                <td className="border p-2">{punch.time_in}</td>
                <td className="border p-2">{punch.time_out}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
*/
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

      <div className="flex gap-2 mb-4">
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
        />*/
       /* <button
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
