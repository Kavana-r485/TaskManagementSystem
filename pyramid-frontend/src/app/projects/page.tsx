'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { AddProjectModal } from '@/components/AddProjectModal';
import { apiFetch } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Project } from '@/types/project';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '@/types/task';

export default function ProjectsPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    apiFetch<Project[]>('/projects')
      .then(setProjects)
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-400">Loading…</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-semibold">Projects</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white"
          >
            <Plus size={14} /> Add Project
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading projects…</p>
        ) : (
          <div className="overflow-x-auto rounded-card border border-gray-100 bg-surface">
            <table className="w-full min-w-[480px] text-sm">
              <thead className="border-b border-gray-100 text-left text-xs text-gray-400">
                <tr>
                  <th className="px-3 py-2 font-normal">Projects</th>
                  <th className="px-3 py-2 font-normal">Priority</th>
                  <th className="px-3 py-2 font-normal">Lead</th>
                  <th className="px-3 py-2 font-normal">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p._id} className="border-b border-gray-50 last:border-0">
                    <td className="px-3 py-2">
                      <a href={`/projects/${p._id}`} className="hover:underline">{p.name}</a>
                    </td>
                    <td className={`px-3 py-2 ${PRIORITY_COLORS[p.priority]}`}>
                      {PRIORITY_LABELS[p.priority]}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-block h-5 w-5 rounded-full bg-gradient-to-br from-accent to-purple-400" />
                    </td>
                    <td className="px-3 py-2 text-gray-500">
                      {p.dueDate ? new Date(p.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-xs text-gray-400">
                      No projects yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <button
              onClick={() => setShowModal(true)}
              className="w-full border-t border-gray-100 p-2 text-center text-xs text-gray-400 hover:text-gray-600"
            >
              + Add Project
            </button>
          </div>
        )}
      </main>

      {showModal && (
        <AddProjectModal
          onClose={() => setShowModal(false)}
          onCreated={(p) => setProjects((prev) => [p, ...prev])}
        />
      )}
    </div>
  );
}
