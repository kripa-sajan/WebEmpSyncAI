"use client";
import { useEffect, useState } from "react";

export default function LeavePage() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({ from_date: "", to_date: "", leave_id: "", custom_reason: "", company_id: "7" });
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetch("/api/leave/types", { headers: { Authorization: `Bearer ${token}`, "X-Company-ID": "7" } })
      .then((res) => res.json())
      .then((data) => setLeaveTypes(data.data || []));

    fetchRequests();
  }, []);

  const fetchRequests = () => {
    fetch("/api/leave/requests", { headers: { Authorization: `Bearer ${token}`, "X-Company-ID": "7" } })
      .then((res) => res.json())
      .then((data) => setRequests(data.data || []));
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleApply = async (e: any) => {
    e.preventDefault();
    setMessage("Submitting...");
    const res = await fetch("/api/leave/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setMessage(data.message);
    setShowForm(false);
    fetchRequests();
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch("/api/leave/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    });
    fetchRequests();
  };

  return (
    <div className="p-4 space-y-6">
      {/* Apply Leave Button */}
      <div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? "Close Apply Leave" : "Apply Leave"}
        </button>
      </div>

      {/* Apply Leave Form (Toggles) */}
      {showForm && (
        <form onSubmit={handleApply} className="border p-4 rounded shadow w-full md:w-1/2">
          <h2 className="text-lg font-bold mb-2">Apply Leave</h2>
          <label>From Date</label>
          <input type="date" name="from_date" onChange={handleChange} required className="block w-full border p-2 rounded mb-2" />
          <label>To Date</label>
          <input type="date" name="to_date" onChange={handleChange} required className="block w-full border p-2 rounded mb-2" />
          <label>Leave Type</label>
          <select name="leave_id" onChange={handleChange} required className="block w-full border p-2 rounded mb-2">
            <option value="">Select Leave Type</option>
            {leaveTypes.map((lt: any) => (
              <option key={lt.id} value={lt.id}>{lt.leave_type}</option>
            ))}
          </select>
          <label>Reason</label>
          <textarea name="custom_reason" onChange={handleChange} className="block w-full border p-2 rounded mb-2" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
          {message && <p className="mt-2 text-sm">{message}</p>}
        </form>
      )}

      {/* Leave Requests Table */}
      <div>
        <h2 className="text-xl font-bold mb-2">Leave Requests</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th>User</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req: any) => (
              <tr key={req.id}>
                <td>{req.user?.first_name}</td>
                <td>{req.from_date}</td>
                <td>{req.to_date}</td>
                <td>{req.custom_reason}</td>
                <td>{req.status}</td>
                <td>
                  <button
                    onClick={() => updateStatus(req.id, "A")}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, "R")}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
