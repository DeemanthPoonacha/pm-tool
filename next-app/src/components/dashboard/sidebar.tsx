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
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800/50 flex flex-col h-screen sticky top-0 z-50">
      <div className="p-8">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
            P
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg tracking-tight leading-none">PM Tool</span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase mt-1">Enterprise</span>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Main Menu</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              )}
            >
              <item.icon className={cn("w-4.5 h-4.5", isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-zinc-800">
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Mike Admin</p>
              <p className="text-[10px] text-zinc-500 truncate font-medium">mike@pmtool.com</p>
            </div>
          </div>
          <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition-colors border border-zinc-700/50">
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
