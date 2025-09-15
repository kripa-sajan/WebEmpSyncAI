/*"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // 👈 required CSS
import { format } from "date-fns";

export default function LeavePage() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    leave_id: "",
    custom_reason: "",
    company_id: "7",
  });
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetch("/api/leave/types", {
      headers: { Authorization: `Bearer ${token}`, "X-Company-ID": "7" },
    })
      .then((res) => res.json())
      .then((data) => setLeaveTypes(data.data || []));

    fetchRequests();
  }, []);

  const fetchRequests = () => {
    fetch("/api/leave/requests", {
      headers: { Authorization: `Bearer ${token}`, "X-Company-ID": "7" },
    })
      .then((res) => res.json())
      .then((data) => setRequests(data.data || []));
  };

  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 Format date as dd-MMM-yyyy (e.g. 04-Sep-2025)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleApply = async (e: any) => {
    e.preventDefault();
    setMessage("Submitting...");

    const payload = {
      ...formData,
      from_date: formData.from_date,
      to_date: formData.to_date,
    };

    const res = await fetch("/api/leave/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setMessage(data.message);
    setShowForm(false);
    fetchRequests();
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch("/api/leave/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, status }),
    });
    fetchRequests();
  };

  return (
    <div className="p-4 space-y-6">
      {/* Apply Leave Button }
      <div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? "Close Apply Leave" : "Apply Leave"}
        </button>
      </div>

      {/* Apply Leave Form (Toggles) }
      {showForm && (
        <form
          onSubmit={handleApply}
          className="border p-4 rounded shadow w-full md:w-1/2"
        >
          <h2 className="text-lg font-bold mb-2">Apply Leave</h2>

          {/* Leave Type }
          <label htmlFor="leave_id">Leave Type</label>
          <select
            id="leave_id"
            name="leave_id"
            onChange={handleChange}
            required
            className="block w-full border p-2 rounded mb-2"
          >
            <option value="">-- Select Leave Type --</option>
            {leaveTypes.map((lt: any) => (
              <option key={lt.id} value={lt.id}>
                {lt.name || lt.leave_type}
              </option>
            ))}
          </select>

          {/* From Date }
          <label htmlFor="from_date">From Date</label>
          <DatePicker
            id="from_date"
            selected={formData.from_date ? new Date(formData.from_date) : null}
            onChange={(date: Date | null) =>
              setFormData({
                ...formData,
                from_date: date ? format(date, "dd-MMM-yyyy") : "",
              })
            }
            dateFormat="dd-MMM-yyyy"
            placeholderText="Select From Date"
            className="block w-full border p-2 rounded mb-2"
          />

          {/* To Date }
          <label htmlFor="to_date">To Date</label>
          <DatePicker
            id="to_date"
            selected={formData.to_date ? new Date(formData.to_date) : null}
            onChange={(date: Date | null) =>
              setFormData({
                ...formData,
                to_date: date ? format(date, "dd-MMM-yyyy") : "",
              })
            }
            dateFormat="dd-MMM-yyyy"
            placeholderText="Select To Date"
            className="block w-full border p-2 rounded mb-2"
          />

          {/* Reason }
          <label htmlFor="custom_reason">Reason</label>
          <textarea
            id="custom_reason"
            name="custom_reason"
            onChange={handleChange}
            className="block w-full border p-2 rounded mb-2"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>

          {message && <p className="mt-2 text-sm">{message}</p>}
        </form>
      )}

      {/* Leave Requests Table }
      <div>
        <h2 className="text-xl font-bold mb-2">Leave Requests</h2>

        {requests.length > 0 ? (
          <table className="w-full border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">User</th>
                <th className="border px-4 py-2 text-left">From</th>
                <th className="border px-4 py-2 text-left">To</th>
                <th className="border px-4 py-2 text-left">Reason</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req: any) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{req.user?.first_name}</td>
                  <td className="border px-4 py-2">
                    {formatDate(req.from_date)}
                  </td>
                  <td className="border px-4 py-2">
                    {formatDate(req.to_date)}
                  </td>
                  <td className="border px-4 py-2">{req.custom_reason}</td>
                  <td className="border px-4 py-2">{req.status}</td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => updateStatus(req.id, "A")}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      title="Approve"
                    >
                      ✅
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, "R")}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      title="Reject"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No leave requests found
          </p>
        )}
      </div>
    </div>
  );
}
*/
/*"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

interface LeaveType {
  id: number;
  name?: string;
  leave_type?: string;
}

interface LeaveRequest {
  id: number;
  user?: {
    first_name: string;
    last_name?: string;
  };
  from_date: string;
  to_date: string;
  custom_reason?: string;
  status: string;
  leave_type?: {
    name: string;
  };
}

export default function LeavePage() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    leave_id: "",
    custom_reason: "",
    leave_choice: "full_day",
  });
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get token from localStorage or cookies
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || localStorage.getItem("access_token");
    }
    return null;
  };

  useEffect(() => {
    fetchLeaveTypes();
    fetchRequests();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const token = getToken();
      const response = await fetch("/api/leave/types", {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Company-ID": "7",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLeaveTypes(data.data || []);
    } catch (error) {
      console.error("Error fetching leave types:", error);
      setError("Failed to load leave types");
    }
  };

  const fetchRequests = async () => {
    try {
      const token = getToken();
      const response = await fetch("/api/leave/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Company-ID": "7",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRequests(data.data || []);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      setError("Failed to load leave requests");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Format date for display (dd-MMM-yyyy)
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateStr;
    }
  };

  // Convert dd-MMM-yyyy to yyyy-MM-dd for API
  const convertDateForApi = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error converting date:", error);
      return dateStr;
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Submitting...");
    setError("");

    try {
      const token = getToken();
      const payload = {
        from_date: convertDateForApi(formData.from_date),
        to_date: convertDateForApi(formData.to_date),
        leave_id: parseInt(formData.leave_id),
        leave_choice: formData.leave_choice,
        custom_reason: formData.custom_reason,
      };

      const response = await fetch("/api/leave/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || "Leave application submitted successfully!");
        setFormData({
          from_date: "",
          to_date: "",
          leave_id: "",
          custom_reason: "",
          leave_choice: "full_day",
        });
        setShowForm(false);
        await fetchRequests();
      } else {
        setError(data.message || "Failed to submit leave application");
      }
    } catch (error) {
      console.error("Error applying for leave:", error);
      setError("Failed to submit leave application");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = getToken();
      const response = await fetch("/api/leave/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        await fetchRequests();
        setMessage(`Leave ${status === 'A' ? 'approved' : 'rejected'} successfully`);
      } else {
        setError("Failed to update leave status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update leave status");
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'a':
      case 'approved':
        return <span className="text-green-600 font-semibold">Approved</span>;
      case 'r':
      case 'rejected':
        return <span className="text-red-600 font-semibold">Rejected</span>;
      case 'p':
      case 'pending':
        return <span className="text-yellow-600 font-semibold">Pending</span>;
      default:
        return <span className="text-gray-600 font-semibold">{status}</span>;
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header }
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {showForm ? "Close Form" : "Apply Leave"}
        </button>
      </div>

      {/* Messages }
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}*/
"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext"; // ✅ import Auth context

interface LeaveType {
  id: number;
  leave_type?: string;
  short_name?: string;
  monthly_limit?: number;
  yearly_limit?: number;
  initial_credit?: number;
  use_credit?: boolean;
}

interface LeaveRequest {
  id: number;
  user?: { first_name: string; last_name?: string };
  from_date: string;
  to_date: string;
  custom_reason?: string;
  status: string;
  leave_type?: { name: string };
}

export default function LeavePage() {
  const { company, switchCompany } = useAuth(); // ✅ get company from context
  const companyId = company?.id; // ✅ dynamic company ID

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    leave_id: "",
    custom_reason: "",
    leave_choice: "full_day",
  });

  const [newType, setNewType] = useState({
    leave_type: "",
    short_name: "",
    monthly_limit: 0,
    yearly_limit: 0,
    initial_credit: 0,
    use_credit: false,
  });

  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || localStorage.getItem("access_token");
    }
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  useEffect(() => {
    if (!companyId) return; // wait until company is loaded
    fetchLeaveTypes();
    fetchRequests();
  }, [companyId]); // ✅ re-fetch when company changes

  // ----------- LEAVE TYPE CRUD ----------------
  const fetchLeaveTypes = async () => {
    if (!companyId) return;
    try {
      const res = await fetch(`/api/leave/types`);
      if (!res.ok) throw new Error("Failed to fetch leave types");
      const data = await res.json();
      setLeaveTypes(data.data || []);
    } catch {
      setError("Failed to load leave types");
    }
  };

  const addLeaveType = async () => {
    if (!companyId) return;
    try {
      const res = await fetch(`/api/leave/types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newType),
      });
      if (!res.ok) throw new Error("Failed to add leave type");
      await fetchLeaveTypes();
      setNewType({
        leave_type: "",
        short_name: "",
        monthly_limit: 0,
        yearly_limit: 0,
        initial_credit: 0,
        use_credit: false,
      });
      setMessage("Leave type added successfully");
    } catch {
      setError("Failed to add leave type");
    }
  };

  const updateLeaveType = async (id: number, name: string) => {
    if (!companyId) return;
    try {
      const res = await fetch(`/api/leave/types`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, leave_type: name }),
      });
      if (!res.ok) throw new Error("Failed to update leave type");
      await fetchLeaveTypes();
      setMessage("Leave type updated successfully");
    } catch {
      setError("Failed to update leave type");
    }
  };

  const deleteLeaveType = async (id: number) => {
    if (!companyId) return;
    try {
      const res = await fetch(`/api/leave/types`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete leave type");
      await fetchLeaveTypes();
      setMessage("Leave type deleted successfully");
    } catch {
      setError("Failed to delete leave type");
    }
  };

  // ----------- LEAVE REQUESTS ----------------
  const fetchRequests = async () => {
    if (!companyId) return;
    try {
      const res = await fetch(`/api/leave/requests`);
      if (!res.ok) throw new Error("Failed to fetch leave requests");
      const data = await res.json();
      setRequests(data.data || []);
    } catch {
      setError("Failed to load leave requests");
    }
  };

  // ---------------- LEAVE APPLY ----------------
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const payload = {
        from_date: formData.from_date,
        to_date: formData.to_date,
        leave_id: parseInt(formData.leave_id),
        leave_choice: formData.leave_choice,
        custom_reason: formData.custom_reason,
        company_id: companyId, // ✅ send dynamic company ID
      };

      const res = await fetch("/api/leave/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Leave application submitted successfully!");
        setFormData({
          from_date: "",
          to_date: "",
          leave_id: "",
          custom_reason: "",
          leave_choice: "full_day",
        });
        setShowForm(false);
        fetchRequests();
      } else {
        setError(data.message || "Failed to submit leave application");
      }
    } catch {
      setError("Failed to submit leave application");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    if (!companyId) return;
    try {
      setMessage("");
      setError("");
      const token = getToken();
      if (!token) {
        setError("Unauthorized");
        return;
      }
      const response = await fetch("/api/leave/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status, company_id: companyId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(
          `Leave ${status === "A" ? "approved" : "rejected"} successfully`
        );
        fetchRequests();
      } else {
        setError(data.message || "Failed to update leave status");
      }
    } catch (err) {
      console.error("Error updating leave status:", err);
      setError("Failed to update leave status");
    }
  };
  
const getStatusDisplay = (status: string) => {
  switch (status.toUpperCase()) {
    case "P":
      return "Pending";
    case "A":
      return "Approved";
    case "R":
      return "Rejected";
    default:
      return status;
  }
};

  // --- UI ---
  return (
   <div className="p-4 space-y-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Leave Management</h1>

      {/* Leave Type Management */}
      <div className="bg-white border rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Manage Leave Types</h2>

        {/* 🔹 updated form UI */}
        {/* 🔹 updated form UI with descriptive labels */}
<div className="space-y-2 mb-4">
  <input
    type="text"
    value={newType.leave_type}
    onChange={(e) => setNewType({ ...newType, leave_type: e.target.value })}
    placeholder="Leave Type (e.g., Sick Leave, Casual Leave)"
    className="border px-3 py-2 rounded w-full"
  />
  <input
    type="text"
    value={newType.short_name}
    onChange={(e) => setNewType({ ...newType, short_name: e.target.value })}
    placeholder="Short Name (e.g., SL, CL)"
    className="border px-3 py-2 rounded w-full"
  />
  <input
    type="number"
    value={newType.monthly_limit}
    onChange={(e) =>
      setNewType({ ...newType, monthly_limit: e.target.value })
    }
    placeholder="Enter maximum leaves allowed per month"
    className="border px-3 py-2 rounded w-full"
  />
  <input
    type="number"
    value={newType.yearly_limit}
    onChange={(e) =>
      setNewType({ ...newType, yearly_limit: e.target.value })
    }
    placeholder="Enter maximum leaves allowed per year"
    className="border px-3 py-2 rounded w-full"
  />
  <input
    type="number"
    value={newType.initial_credit}
    onChange={(e) =>
      setNewType({ ...newType, initial_credit: e.target.value })
    }
    placeholder="Enter starting leave balance"
    className="border px-3 py-2 rounded w-full"
  />
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={newType.use_credit}
      onChange={(e) =>
        setNewType({ ...newType, use_credit: e.target.checked })
      }
    />
    <span>Can use leave credit</span>
  </label>

  <button
    onClick={addLeaveType}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Add
  </button>
</div>


        {/* Leave Type Table (unchanged except using leave_type field) */}
        <table className="w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Leave Type</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveTypes.map((lt) => (
              <tr key={lt.id} className="border-t">
                <td className="px-4 py-2">{lt.id}</td>
                <td className="px-4 py-2">{lt.leave_type}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() =>
                      updateLeaveType(lt.id, prompt("Edit leave type", lt.leave_type || "") || "")
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteLeaveType(lt.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {leaveTypes.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-3 text-gray-500">
                  No leave types found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      

      {/* Apply Leave Form */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {showForm ? "Close Form" : "Apply Leave"}
        </button>
      </div>
      {showForm && (
        <div className="bg-white border rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Apply for Leave
          </h2>

          <form onSubmit={handleApply} className="space-y-4">
            {/* Leave Type */}
            <div>
              <label htmlFor="leave_id" className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type *
              </label>
              <select
                id="leave_id"
                name="leave_id"
                value={formData.leave_id}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Leave Type --</option>
                {leaveTypes.map((lt) => (
                  <option key={lt.id} value={lt.id}>
                    {lt.name || lt.leave_type}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="from_date" className="block text-sm font-medium text-gray-700 mb-1">
                  From Date *
                </label>
                <DatePicker
                  id="from_date"
                  selected={formData.from_date ? new Date(formData.from_date) : null}
                  onChange={(date: Date | null) =>
                    setFormData({
                      ...formData,
                      from_date: date ? format(date, "dd-MMM-yyyy") : "",
                    })
                  }
                  dateFormat="dd-MMM-yyyy"
                  placeholderText="Select From Date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minDate={new Date()}
                />
              </div>

              <div>
                <label htmlFor="to_date" className="block text-sm font-medium text-gray-700 mb-1">
                  To Date *
                </label>
                <DatePicker
                  id="to_date"
                  selected={formData.to_date ? new Date(formData.to_date) : null}
                  onChange={(date: Date | null) =>
                    setFormData({
                      ...formData,
                      to_date: date ? format(date, "dd-MMM-yyyy") : "",
                    })
                  }
                  dateFormat="dd-MMM-yyyy"
                  placeholderText="Select To Date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minDate={formData.from_date ? new Date(formData.from_date) : new Date()}
                />
              </div>
            </div>

            {/* Leave Choice */}
            <div>
              <label htmlFor="leave_choice" className="block text-sm font-medium text-gray-700 mb-1">
                Leave Choice
              </label>
              <select
                id="leave_choice"
                name="leave_choice"
                value={formData.leave_choice}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="full_day">Full Day</option>
                <option value="half_day">Half Day</option>
              </select>
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="custom_reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <textarea
                id="custom_reason"
                name="custom_reason"
                value={formData.custom_reason}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter reason for leave application"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      )}

      {/* Leave Requests Table */}
      <div className="bg-white border rounded-lg shadow-md">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Leave Requests</h2>
        </div>

        <div className="overflow-x-auto">
          {requests.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {req.user?.first_name} {req.user?.last_name || ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {req.from_date ? format(new Date(req.from_date), "dd-MMM-yyyy") : ""}

                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {req.from_date ? format(new Date(req.to_date), "dd-MMM-yyyy") : ""}

                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {req.custom_reason || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusDisplay(req.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {req.status.toUpperCase() === "P" ? (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => updateStatus(req.id, "A")}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          title="Approve"
                        >
                          ✅
                        </button>
                        <button
                          onClick={() => updateStatus(req.id, "R")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          title="Reject"
                        >
                          ❌
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">No actions</span>
                    )}
                  </td>

                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No leave requests found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

