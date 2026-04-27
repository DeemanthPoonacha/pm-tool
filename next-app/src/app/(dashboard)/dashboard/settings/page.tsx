import { getAllUsers } from '@/lib/permissions';
import { runQuery } from '@/db';

export default function SettingsPage() {
  const users = getAllUsers();
  const currentUser = users.find(u => u.email === 'mike@pmtool.com') || users[0];
  
  const stats = runQuery(`
    SELECT 
      (SELECT COUNT(*) FROM projects) as projects,
      (SELECT COUNT(*) FROM tasks) as tasks,
      (SELECT COUNT(*) FROM requirements) as requirements,
      (SELECT COUNT(*) FROM change_requests) as change_requests,
      (SELECT COUNT(*) FROM users) as users
  `)[0] || {};

  return (
    <div className="flex h-screen">
      <aside className="w-56 bg-zinc-900 p-4">
        <div className="text-white font-semibold text-lg mb-6">PM Tool</div>
        <nav className="space-y-1">
          <a href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Dashboard</a>
          <a href="/dashboard/projects" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Projects</a>
          <a href="/dashboard/tasks" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Tasks</a>
          <a href="/dashboard/requirements" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Requirements</a>
          <a href="/dashboard/change-requests" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Change Requests</a>
          <a href="/dashboard/documents" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Documents</a>
          <a href="/dashboard/notifications" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Notifications</a>
          <a href="/dashboard/team" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Team</a>
          <a href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 text-white text-sm">Settings</a>
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
          <div className="text-sm text-zinc-600">Settings</div>
          <div className="flex items-center gap-3">
            <span className="text-sm">{currentUser?.full_name || 'User'}</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {(currentUser?.full_name || 'U').charAt(0)}
            </div>
          </div>
        </header>

        <main className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Settings</h1>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h2 className="font-semibold mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-600 mb-1">Display Name</label>
                  <input type="text" defaultValue={currentUser?.full_name || ''} className="w-full px-3 py-2 rounded-lg border border-zinc-300" />
                </div>
                <div>
                  <label className="block text-sm text-zinc-600 mb-1">Email</label>
                  <input type="email" defaultValue={currentUser?.email || ''} className="w-full px-3 py-2 rounded-lg border border-zinc-300" disabled />
                </div>
                <div>
                  <label className="block text-sm text-zinc-600 mb-1">Role</label>
                  <input type="text" defaultValue={currentUser?.role || ''} className="w-full px-3 py-2 rounded-lg border border-zinc-300" disabled />
                </div>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h2 className="font-semibold mb-4">Statistics</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Total Projects</span>
                  <span className="font-semibold">{stats.projects || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Total Tasks</span>
                  <span className="font-semibold">{stats.tasks || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Requirements</span>
                  <span className="font-semibold">{stats.requirements || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Change Requests</span>
                  <span className="font-semibold">{stats.change_requests || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Team Members</span>
                  <span className="font-semibold">{stats.users || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h2 className="font-semibold mb-4">Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">Email notifications</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">Task assignments</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">Project updates</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">Weekly digest</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-zinc-200 p-6">
            <h2 className="font-semibold mb-4">About PM Tool</h2>
            <div className="space-y-2 text-sm text-zinc-600">
              <p>Version: 0.1.0</p>
              <p>Product Management Tool - A comprehensive project management solution</p>
              <p className="text-zinc-400">Built with Next.js, better-sqlite3, and React</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}