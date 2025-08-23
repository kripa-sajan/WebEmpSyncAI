'use client'
import { useAuth } from "@/context/AuthContext";

export default function EmployeesPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <div>
      <h1 className="text-3xl font-bold text-foreground">Employees</h1>
      <p className="text-lg">This is the Employees page.</p>
      <p>User not found. Please log in.</p>
    </div>;
  }
  
  return <div>
    <h1 className="text-3xl font-bold text-foreground">Employees</h1>
    <p className="text-lg">This is the Employees page.</p>
    <p>User: {user.email}</p>
    <p>Role: {user.role}</p>
  </div> 
}
