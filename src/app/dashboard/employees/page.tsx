
"use client"

import { useAuth } from "@/context/AuthContext";
import { User } from "@/context/AuthContext"
import { useEmployees } from "@/hooks/employees/useGetEmployees"
import Link from "next/link";

function EmployeesList({ companyId }: { companyId: number }) {
  const { data, isLoading, isError } = useEmployees(companyId)

  if (isLoading) return <p>Loading employees...</p>
  if (isError) return <p>Failed to load employees</p>

  return (
    <ul className="space-y-2">
      {data?.map((emp: User, index: number) => (
        <Link href={`/dashboard/employees/${emp.id}`} key={`${emp.id}-${index}`}>
          <li className="border p-2 rounded-md cursor-pointer hover:bg-gray-100">
            <p className="font-medium">{emp.first_name} {emp.last_name}</p>
            <p className="text-sm text-gray-500">{emp.email}</p>
          </li>
        </Link>
      ))}
    </ul>
  )
}

export default function EmployeesPage() {
  const { company } = useAuth();

  if (!company) {
    return <p>No company selected</p>;
  }

  return <EmployeesList companyId={company.id} />;
}
/*"use client"

import { useAuth } from "@/context/AuthContext";
import { User } from "@/context/AuthContext"
import { useEmployees } from "@/hooks/employees/useGetEmployees"
import Link from "next/link"
import { useState, useEffect } from "react"

function EmployeesList({ companyId }: { companyId: number }) {
  const { data, isLoading, isError } = useEmployees(companyId)

  if (isLoading) return <p>Loading employees...</p>
  if (isError) return <p>Failed to load employees</p>

  return (
    <ul className="space-y-2">
      {data?.map((emp: User) => (
        <Link href={`/dashboard/employees/${emp.id}`} key={emp.id}>
          <li className="border p-2 rounded-md cursor-pointer hover:bg-gray-100">
            <p className="font-medium">{emp.first_name} {emp.last_name}</p>
            <p className="text-sm text-gray-500">{emp.email}</p>
          </li>
        </Link>
      ))}
    </ul>
  )
}

export default function EmployeesPage() {
  const { company } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Render nothing on server, show loading initially
  if (!mounted) return null
  if (!company) return <p>No company selected</p>

  return <EmployeesList companyId={company.id} />
}

*/