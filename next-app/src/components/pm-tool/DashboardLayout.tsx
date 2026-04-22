import * as React from 'react'

export function DashboardLayout({children}: {children: React.ReactNode}) {
  return <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">{children}</div>
}

export function Navbar() { return null }
export function Sidebar() { return null }
export function Breadcrumb() { return null }
