"use client"

import { useGroups } from "@/hooks/settings/groups/useGroups"



export default function GroupsPage() {
  const { data, isLoading, isError } = useGroups()

  if (isLoading) return <p>Loading groups...</p>
  if (isError) return <p>Failed to load groups</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Groups</h1>

      <ul className="space-y-2">
        {data?.data?.map((group: any) => (
          <li
            key={group.id}
            className="border p-2 rounded-md bg-gray-50 hover:bg-gray-100"
          >
            <p>{group.id}</p>
            <p className="font-medium">{group.group}</p>
            <p className="text-sm text-gray-500">{group.short_name}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
