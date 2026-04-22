import { redirect } from "next/navigation";
import Link from "next/link";
import { getAllUsers } from "@/lib/permissions";
import { getProjects, createProject } from "@/lib/projects";
import { v4 as uuidv4 } from 'uuid';

export default function NewProjectPage() {
  const clients = getAllUsers().filter(u => u.role === 'client');
  const allTeam = getAllUsers().filter(u => u.role !== 'admin');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300 transition">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Create New Project
            </h1>
          </div>
          <form action="/api/projects" method="post" className="p-6 space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Project Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enterprise CRM Migration"
              />
            </div>

            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Client *
              </label>
              <select
                id="clientId"
                name="clientId"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.full_name} ({client.email})</option>
                ))}
                {clients.length === 0 && <option value="">No clients yet</option>}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Brief description of the project..."
              />
            </div>

            <div>
              <label htmlFor="team" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Team Members
              </label>
              <div className="space-y-2">
                {allTeam.map(user => (
                  <label key={user.id} className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition">
                    <input
                      type="checkbox"
                      name="team"
                      value={user.id}
                      className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{user.full_name}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">{user.email} • {user.role}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Create Project
              </button>
              <Link href="/dashboard" className="px-6 py-2.5 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-medium rounded-lg transition-colors text-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
