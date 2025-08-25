"use client";

import { useState } from "react";
import { useRoles } from "@/hooks/settings/useRoles";
import { useAddRole } from "@/hooks/settings/useAddRole";
import LoadingPage from "../../loading";
import { useAuth } from "@/context/AuthContext";

export default function RolesPage() {
  const { data, isLoading, isError } = useRoles();
  const { company } = useAuth();
  const addRoleMutation = useAddRole();

  const [newRole, setNewRole] = useState("");

  if (isLoading) return <LoadingPage />;
  if (isError) return <p>Failed to load Roles</p>;

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.trim() || !company?.id) return;

    addRoleMutation.mutate(
      {
        role: newRole.trim(),
        company_id: [company.id],
      },
      {
        onSuccess: () => {
          setNewRole(""); 
        },
      }
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Roles</h1>

      {/* Add Role Form */}
      <form onSubmit={handleAddRole} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Enter new role"
          className="flex-1 border rounded-md p-2"
        />
        <button
          type="submit"
          disabled={addRoleMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {addRoleMutation.isPending ? "Adding..." : "Add"}
        </button>
      </form>

      {/* Roles List */}
      <ul className="space-y-2">
        {data?.data?.map((role: any) => (
          <li
            key={role.id}
            className="border p-2 rounded-md bg-gray-50 hover:bg-gray-100"
          >
            <p className="font-medium">{role.role}</p>
            <p className="text-sm text-gray-500">{role.working_hour}</p>
          </li>
        ))}
      </ul>

      {/* Feedback */}
      {addRoleMutation.isError && (
        <p className="text-red-500 mt-2">
          {(addRoleMutation.error as Error).message}
        </p>
      )}
    </div>
  );
}
