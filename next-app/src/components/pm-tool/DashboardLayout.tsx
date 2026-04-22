'use client'
import * as React from 'react'

const DashboardLayout = ({children}: {children: React.ReactNode}) => (
  <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
    {children}
  </div>
)

const Navbar = () => null
const Sidebar = () => null
const Breadcrumb = () => null

export { DashboardLayout, Navbar, Sidebar, Breadcrumb }
