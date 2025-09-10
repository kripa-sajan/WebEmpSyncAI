/*"use client";
import { useEffect, useState } from "react";

interface Attendance {
  date: string;
  status: string;
  punch_time?: string | null;
  message?: string;
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  // Example: fetch punches for a date range
  const startDate = "2025-09-01";
  const endDate = "2025-09-03";

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch("/api/attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_id: 7,
            biometric_id: 2147483647,
            user_id: 2147483647,
            start_date: startDate,
            end_date: endDate,
            today: false, // historical punches
          }),
        });

        if (!res.ok) {
          console.error("Failed to fetch attendance", await res.text());
          return;
        }

        const data = await res.json();
        // Ensure data is an array
        setAttendance(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>

      {loading ? (
        <p>Loading attendance...</p>
      ) : attendance.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Check-In / Check-Out</th>
              <th className="p-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{record.date}</td>
                <td className="p-2">{record.status}</td>
                <td className="p-2">{record.punch_time || "--"}</td>
                <td className="p-2">{record.message || "--"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
*/
"use client";
import { useEffect, useState } from "react";

interface Attendance {
  date: string;
  status: string;
  punch_time?: string | null;
  message?: string;
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date()); // default: today

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const fetchAttendance = async (date: Date) => {
    setLoading(true);
    try {
      const dateStr = formatDate(date);

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: 7,
          biometric_id: 2147483647,
          user_id: 2147483647,
          start_date: dateStr,
          end_date: dateStr,
          today: false, // historical punches
        }),
      });

      if (!res.ok) {
        console.error("Failed to fetch attendance", await res.text());
        setAttendance([]);
        return;
      }

      const data = await res.json();
      setAttendance(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>

      <div className="mb-4">
        <label className="mr-2 font-medium">Select Date: </label>
        <input
          type="date"
          value={formatDate(selectedDate)}
          onChange={handleDateChange}
          className="border px-2 py-1 rounded"
        />
      </div>

      {loading ? (
        <p>Loading attendance...</p>
      ) : attendance.length === 0 ? (
        <p>No attendance records found for this date.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Check-In / Check-Out</th>
              <th className="p-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{record.date}</td>
                <td className="p-2">{record.status}</td>
                <td className="p-2">{record.punch_time || "--"}</td>
                <td className="p-2">{record.message || "--"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

