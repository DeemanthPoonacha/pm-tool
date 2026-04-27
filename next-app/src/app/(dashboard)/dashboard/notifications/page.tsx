export default function NotificationsPage() {
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
          <a href="/dashboard/notifications" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 text-white text-sm">Notifications</a>
          <a href="/dashboard/team" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Team</a>
          <a href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Settings</a>
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
          <div className="text-sm text-zinc-600">Notifications</div>
          <div className="flex items-center gap-3">
            <span className="text-sm">Mike</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">M</div>
          </div>
        </header>

        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Notifications</h1>
            <button className="text-sm text-blue-600 hover:text-blue-700">Mark all as read</button>
          </div>

          <div className="bg-white rounded-lg border border-zinc-200">
            <div className="p-8 text-center text-zinc-500">
              <div className="text-4xl mb-4">🔔</div>
              <p className="text-lg">No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-lg border border-zinc-200 p-6">
            <h2 className="font-semibold mb-4">Notification Settings</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-zinc-200 rounded-lg hover:bg-zinc-50">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <div>
                  <div className="font-medium">Task Assignments</div>
                  <div className="text-xs text-zinc-500">Get notified when tasks are assigned to you</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-zinc-200 rounded-lg hover:bg-zinc-50">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <div>
                  <div className="font-medium">Project Updates</div>
                  <div className="text-xs text-zinc-500">Get notified about project status changes</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-zinc-200 rounded-lg hover:bg-zinc-50">
                <input type="checkbox" className="w-4 h-4" />
                <div>
                  <div className="font-medium">Requirement Reviews</div>
                  <div className="text-xs text-zinc-500">Get notified when requirements need your approval</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-zinc-200 rounded-lg hover:bg-zinc-50">
                <input type="checkbox" className="w-4 h-4" />
                <div>
                  <div className="font-medium">Change Request Updates</div>
                  <div className="text-xs text-zinc-500">Get notified about change request status changes</div>
                </div>
              </label>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}