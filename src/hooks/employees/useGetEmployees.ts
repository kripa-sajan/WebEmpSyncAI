// hooks/useEmployees.ts
"use client"

import { User } from "@/context/AuthContext"
import { useQuery } from "@tanstack/react-query"

async function fetchEmployees(companyId: number) {
  const res = await fetch("/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ company_id: companyId }),
  })

  if (!res.ok) {
    throw new Error("Failed to fetch employees")
  }

  return res.json()
}

export function useEmployees(companyId?: number) {
  return useQuery<User[]>({
    queryKey: ["employees", companyId],
    queryFn: () => fetchEmployees(companyId as number),
    enabled: !!companyId, // only run if companyId is provided
    staleTime: 5 * 60 * 1000, // 5 min caching
  })
}
