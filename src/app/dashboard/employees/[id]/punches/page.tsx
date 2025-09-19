/*"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export default function EmployeePunchPage() {
  const { id } = useParams();
  const { company } = useAuth();

  const [punches, setPunches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchPunches = async () => {
    if (!company || !startDate || !endDate) return;
    setLoading(true);

    try {
      const payload = {
        biometric_id: id,
        company_id: company.id,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
      };

      const res = await fetch("/api/punch/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      const rawList: any[] = json?.data ?? [];

      const grouped: Record<string, Date[]> = {};

      rawList.forEach((p) => {
        if (!p.punch_time) return;

        // Try parsing as ISO first
        let dtUTC: Date = parseISO(p.punch_time);
        if (isNaN(dtUTC.getTime())) {
          // fallback: try plain Date constructor
          dtUTC = new Date(p.punch_time);
        }

        if (isNaN(dtUTC.getTime())) {
          console.warn("Skipping invalid date:", p.punch_time);
          return;
        }

        // Convert UTC → IST
        const dtIST = toZonedTime(dtUTC, { timeZone: "Asia/Kolkata" });
        const dateKey = format(dtIST, "yyyy-MM-dd");

        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(dtIST);
      });

      const processed = Object.keys(grouped)
        .sort((a, b) => (a < b ? 1 : -1)) // newest first
        .map((dateKey) => {
          const dayTimes = grouped[dateKey].sort(
            (a, b) => a.getTime() - b.getTime()
          );

          const punchIn = dayTimes[0] ? format(dayTimes[0], "HH:mm") : "-";
          const punchOut =
            dayTimes.length > 1
              ? format(dayTimes[dayTimes.length - 1], "HH:mm")
              : "-";

          let status = "Leave";
          if (punchIn !== "-" && punchOut !== "-") status = "Present";
          else if (punchIn !== "-" || punchOut !== "-")
            status = "Partial punch recorded";

          return {
            date: format(new Date(dateKey), "dd-MMM-yyyy"),
            punchIn,
            punchOut,
            status,
          };
        });

      setPunches(processed);
    } catch (err) {
      console.error("Error fetching punches:", err);
      setPunches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) fetchPunches();
  }, [company, id, startDate, endDate]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Punch Records</h2>

      <div className="flex items-center gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(d: Date) => setStartDate(d)}
            dateFormat="dd-MMM-yyyy"
            placeholderText="Select start date"
            className="border px-2 py-1 rounded"
            maxDate={new Date()}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(d: Date) => setEndDate(d)}
            dateFormat="dd-MMM-yyyy"
            placeholderText="Select end date"
            className="border px-2 py-1 rounded"
            maxDate={new Date()}
          />
        </div>

        <button
          onClick={fetchPunches}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Fetch
        </button>
      </div>

      {loading ? (
        <p>Loading punches...</p>
      ) : punches.length === 0 ? (
        <p>No punches found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Date</th>
                <th className="border px-4 py-2 text-left">Punch In</th>
                <th className="border px-4 py-2 text-left">Punch Out</th>
                <th className="border px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {punches.map((p, idx) => (
                <tr key={idx} className="hover:bg-gray-50 align-top">
                  <td className="border px-4 py-2">{p.date}</td>
                  <td className="border px-4 py-2">{p.punchIn}</td>
                  <td className="border px-4 py-2">{p.punchOut}</td>
                  <td className="border px-4 py-2">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}*/

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";

export default function EmployeePunchPage() {
  const { id } = useParams(); // biometric_id (or employee identifier used by backend)
  const { company } = useAuth();

  const [punches, setPunches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Helpers -----------------------------------------------------------------
  const tryParseDate = (raw: any, record: any): Date | null => {
    if (!raw) return null;

    if (raw instanceof Date && !isNaN(raw.getTime())) return raw;

    try {
      const iso = typeof raw === "string" ? raw.trim() : "";
      if (iso) {
        const dt = parseISO(iso);
        if (!isNaN(dt.getTime())) return dt;
      }
    } catch (e) {}

    const datePart = (record?.date || record?.day || "").toString().trim();
    const timePart = raw.toString().trim();
    if (datePart && /^\d{2,4}[-/]/.test(datePart) && /^\d{1,2}[:]/.test(timePart)) {
      const combined = `${datePart}T${timePart}`;
      const dt = new Date(combined);
      if (!isNaN(dt.getTime())) return dt;
    }

    const dt2 = new Date(raw);
    if (!isNaN(dt2.getTime())) return dt2;

    return null;
  };

  const getRecordDatetime = (r: any): Date | null => {
    return (
      tryParseDate(
        r.punch_time ?? r.punchTime ?? r.timestamp ?? r.time ?? r.created_at ?? r.created ?? r.date,
        r
      ) || null
    );
  };

  const getNormalizedType = (r: any): string => {
    const s = (r.status ?? r.type ?? r.punch_type ?? r.event_type ?? "").toString();
    if (/check[-_\s]?in/i.test(s)) return "Check-In";
    if (/check[-_\s]?out/i.test(s)) return "Check-Out";
    if (/^in$/i.test(s)) return "Check-In";
    if (/^out$/i.test(s)) return "Check-Out";
    return "";
  };

  // Fetch + process ---------------------------------------------------------
  const fetchPunches = async () => {
    if (!company || !startDate || !endDate) return;

    setLoading(true);
    try {
      const payload = {
        biometric_id: id,
        company_id: company.id,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
      };

      const res = await fetch("/api/punch/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      const rawList: any[] = json?.data ?? [];

      const grouped: Record<string, any[]> = {};

      for (const rec of rawList) {
        const dt = getRecordDatetime(rec);
        if (!dt) continue;

        const dateKey = format(dt, "yyyy-MM-dd");
        if (!grouped[dateKey]) grouped[dateKey] = [];

        grouped[dateKey].push({
          datetime: dt,
          timeStr: format(dt, "HH:mm"),
          type: getNormalizedType(rec),
        });
      }

      const rows = Object.keys(grouped)
        .sort((a, b) => (a < b ? 1 : -1))
        .map((dateKey) => {
          const entries = grouped[dateKey].sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

          const checkIns = entries.filter((e) => e.type === "Check-In");
          const checkOuts = entries.filter((e) => e.type === "Check-Out");

          const punchIn = checkIns.length > 0 ? checkIns[0].timeStr : entries[0]?.timeStr ?? "-";
          const punchOut =
            checkOuts.length > 0 ? checkOuts[checkOuts.length - 1].timeStr : entries.length > 1 ? entries[entries.length - 1].timeStr : "-";

          let status = "No punches recorded";
          if (entries.length === 0) status = "leave";
          else if (punchIn !== "-" && punchOut !== "-") status = "Present";
          else status = "Partial punch recorded";

          return {
            dateDisplay: format(new Date(dateKey), "dd-MMM-yyyy"),
            punchIn,
            punchOut,
            status,
          };
        });

      setPunches(rows);
    } catch (err) {
      console.error("Failed to fetch/process punches", err);
      setPunches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // optional: auto-set current month if desired
  }, [company]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Punch Records</h2>

      <div className="flex items-center gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(d: Date) => setStartDate(d)}
            dateFormat="dd-MMM-yyyy"
            placeholderText="Select start date"
            className="border px-2 py-1 rounded"
            maxDate={new Date()}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(d: Date) => setEndDate(d)}
            dateFormat="dd-MMM-yyyy"
            placeholderText="Select end date"
            className="border px-2 py-1 rounded"
            maxDate={new Date()}
          />
        </div>

        <button
          onClick={fetchPunches}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Fetch
        </button>
      </div>

      {loading ? (
        <p>Loading punches...</p>
      ) : punches.length === 0 ? (
        <p>No punches found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Date</th>
                <th className="border px-4 py-2 text-left">Punch In</th>
                <th className="border px-4 py-2 text-left">Punch Out</th>
                <th className="border px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {punches.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50 align-top">
                  <td className="border px-4 py-2">{r.dateDisplay}</td>
                  <td className="border px-4 py-2">{r.punchIn}</td>
                  <td className="border px-4 py-2">{r.punchOut}</td>
                  <td className="border px-4 py-2">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
