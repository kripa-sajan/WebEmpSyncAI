/*"use client"

import { useState, useEffect } from "react"
import { useAttendance } from "@/hooks/attendance/useAttendance"
import { useAuth } from "@/context/AuthContext"

export default function AttendancePage() {
  const { company, user } = useAuth() // ✅ Get logged-in user & company directly
  const [biometricId, setBiometricId] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split("T")[0]

  // Fetch biometric_id (if not available in context)
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!company) return
      try {
        const res = await fetch(`/api/companies?company_id=${company.id}`)
        const details = await res.json()
        setBiometricId(details.biometric_id)
      } catch (err) {
        console.error("Failed to fetch user details:", err)
      }
    }
    fetchUserDetails()
  }, [company])

  // Hook for attendance
  const { data: attendance, isLoading, isError } = useAttendance(
    company && user && biometricId
      ? {
          company_id: company.id,
          user_id: user.id,
          biometric_id: biometricId,
          start_date: formatDate(selectedDate),
          end_date: formatDate(selectedDate),
          today: false,
        }
      : undefined
  )

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value)
    if (!isNaN(newDate.getTime())) setSelectedDate(newDate)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>

      {/* Date Selector }
      <div className="mb-4">
        <label className="mr-2 font-medium">Select Date: </label>
        <input
          type="date"
          value={formatDate(selectedDate)}
          onChange={handleDateChange}
          className="border px-2 py-1 rounded"
        />
      </div>

      {/* Attendance Table }
      {isLoading ? (
        <p>Loading attendance...</p>
      ) : isError ? (
        <p>Failed to load attendance</p>
      ) : !attendance || attendance.length === 0 ? (
        <p>No attendance records found for this date.</p>
      ) : (
        <div className="overflow-x-auto">
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
        </div>
      )}
    </div>
  )
}
  */"use client"

import { useState } from "react"
import { useAttendance } from "@/hooks/attendance/useAttendance"
import { useAuth } from "@/context/AuthContext"

export default function AttendancePage() {
  const { company, user } = useAuth() // ✅ Get logged-in user & company
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split("T")[0]

  // ✅ Attendance Hook (no extra fetch for biometric_id unless required)
  const { data: attendance, isLoading, isError } = useAttendance(
    company && user
      ? {
          company_id: company.id,
          user_id: user.id,
          // Remove biometric_id if not strictly required
          start_date: formatDate(selectedDate),
          end_date: formatDate(selectedDate),
          today: false,
        }
      : undefined
  )

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value)
    if (!isNaN(newDate.getTime())) setSelectedDate(newDate)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>

      {/* Date Selector */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Select Date: </label>
        <input
          type="date"
          value={formatDate(selectedDate)}
          onChange={handleDateChange}
          className="border px-2 py-1 rounded"
        />
      </div>

      {/* Attendance Table */}
      {!company || !user ? (
        <p>Loading user/company details...</p>
      ) : isLoading ? (
        <p>Loading attendance...</p>
      ) : isError ? (
        <p>Failed to load attendance.</p>
      ) : !attendance || attendance.length === 0 ? (
        <p>No attendance records found for this date.</p>
      ) : (
        <div className="overflow-x-auto">
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
        </div>
      )}
    </div>
  )
}

