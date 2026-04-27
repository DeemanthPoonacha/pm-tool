'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  FileText, 
  FileEdit, 
  Files, 
  Bell, 
  Users, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Requirements', href: '/dashboard/requirements', icon: FileText },
  { name: 'Change Requests', href: '/dashboard/change-requests', icon: FileEdit },
  { name: 'Documents', href: '/dashboard/documents', icon: Files },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-900 dark:bg-black border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
          <span className="text-white font-semibold text-lg tracking-tight">PM Tool</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">M</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Mike Admin</p>
            <p className="text-xs text-zinc-500 truncate">mike@pmtool.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
