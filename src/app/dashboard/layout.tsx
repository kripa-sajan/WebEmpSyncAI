import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { SignOutButton } from "@/components/sign-out-button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
