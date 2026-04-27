'use client';

import { Bell, Search, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-16 border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        <div className="max-w-md w-full relative hidden md:block ml-8">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Quick search..." 
            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-zinc-600"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="p-2 text-zinc-400 hover:text-white bg-zinc-900/50 rounded-xl border border-zinc-800/50 transition-all relative group">
          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-zinc-950 animate-pulse"></span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-zinc-800/50">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-none">Mike Admin</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Project Manager</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20 border border-white/10">
            M
          </div>
        </div>
      </div>
    </header>
  );
}
