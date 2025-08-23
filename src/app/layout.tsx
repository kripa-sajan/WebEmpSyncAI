import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import Providers from "@/providers/query-client"
import { AuthProvider } from "@/context/AuthContext"

export const metadata: Metadata = {
  title: "EmpSync AI - Admin Dashboard",
  description: "Employee synchronization and management platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
       
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
          <Providers>
          {children}
          </Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
