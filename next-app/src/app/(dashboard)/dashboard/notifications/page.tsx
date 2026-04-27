import { Header } from '@/components/dashboard/header';
import { Bell, Info } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <>
      <Header title="Notifications" />
      <main className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Notifications</h1>
            <p className="text-zinc-500 text-sm mt-1">Stay updated with project changes and team activity</p>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Mark all as read
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white">All caught up!</h3>
            <p className="text-zinc-500 mt-1 max-w-xs mx-auto">You don't have any new notifications at the moment.</p>
          </div>
        </div>
      </main>
    </>
  );
}