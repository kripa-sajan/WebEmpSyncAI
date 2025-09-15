// hooks/useAttendance.ts
"use client"

import { useQuery } from "@tanstack/react-query"

export interface Attendance {
  date: string
  status: string
  punch_time?: string | null
  message?: string | null
}

interface AttendanceParams {
  company_id: number | string
  user_id: number
  biometric_id: number
  start_date: string
  end_date: string
  today?: boolean
}

async function fetchAttendance(params: AttendanceParams) {
  const res = await fetch("/api/attendance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    throw new Error("Failed to fetch attendance")
  }

  return res.json()
}

export function useAttendance(params?: AttendanceParams) {
  return useQuery<Attendance[]>({
    queryKey: ["attendance", params],
    queryFn: () => fetchAttendance(params as AttendanceParams),
    enabled: !!params, // run only if params are passed
    staleTime: 5 * 60 * 1000, // cache 5 mins
    select: (data) => (Array.isArray(data.data) ? data.data : []),
  })
}
