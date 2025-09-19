"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"

export interface Attendance {
  date: string
  status: string
  punch_time?: string | null
  message?: string | null
}

export interface AttendanceParams {
  start_date: string
  end_date: string
  today?: boolean
}

async function fetchAttendance(params: {
  company_id: number
  biometric_id: number
  start_date: string
  end_date: string
  today?: boolean
}) {
  const res = await fetch("/api/attendance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Failed to fetch attendance: ${errorText}`)
  }

  const data = await res.json()

// ✅ Handle nested response
if (Array.isArray(data.data)) return data.data
if (Array.isArray(data.data?.results)) return data.data.results
if (Array.isArray(data.results)) return data.results

return []
}

export function useAttendance(params?: AttendanceParams) {
  const { company, user, loading } = useAuth()

  const enabled = !!company?.id && !!user?.biometric_id && !!params && !loading

  return useQuery<Attendance[]>({
    queryKey: ["attendance", params, company?.id, user?.biometric_id],
    queryFn: () =>
      fetchAttendance({
        company_id: company!.id,
        biometric_id: Number(user!.biometric_id),
        start_date: params!.start_date,
        end_date: params!.end_date,
        today: params?.today,
      }),
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
