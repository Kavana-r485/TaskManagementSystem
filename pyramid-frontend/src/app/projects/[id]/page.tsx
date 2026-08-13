'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { apiFetch } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Project } from '@/types/project';
import { Task, STATUS_LABELS, TaskStatus, PRIORITY_LABELS, PRIORITY_COLORS } from '@/types/task';

const COLUMNS: TaskStatus[] = ['to_do', 'doing', 'completed', 'on_hold'];

export default function ProjectDetailPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;
    Promise.all([
      apiFetch<Project>(`/projects/${id}`),
      apiFetch<Task[]>(`/tasks?project=${id}`),
    ])
      .then(([p, t]) => {
        setProject(p);
        setTasks(t);
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  if (authLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-400">Loading…</div>;
  }

  const grouped = COLUMNS.reduce<Record<TaskStatus, Task[]>>((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6">
        <div className="mb-4 flex items-center gap-1 text-sm text-gray-400">
          <Link href="/projects" className="hover:underline">Projects</Link>
          <span>/</span>
          <span className="font-medium text-gray-700">
            {loading ? '…' : project?.name}
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : (
          <div className="space-y-6">
            {COLUMNS.map((status) => (
              <div key={status}>
                <p className="mb-1 text-sm font-medium text-gray-600">{STATUS_LABELS[status]}</p>
                <div className="overflow-x-auto rounded-card border border-gray-100 bg-surface">
                  <table className="w-full min-w-[420px] text-sm">
                    <thead className="border-b border-gray-100 text-left text-xs text-gray-400">
                      <tr>
                        <th className="px-3 py-2 font-normal">Task</th>
                        <th className="px-3 py-2 font-normal">Priority</th>
                        <th className="px-3 py-2 font-normal">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grouped[status].map((task) => (
                        <tr key={task._id} className="border-b border-gray-50 last:border-0">
                          <td className="px-3 py-2">
                            <a href={`/tasks/${task._id}`} className="hover:underline">{task.title}</a>
                          </td>
                          <td className={`px-3 py-2 ${PRIORITY_COLORS[task.priority]}`}>
                            {PRIORITY_LABELS[task.priority]}
                          </td>
                          <td className="px-3 py-2 text-gray-500">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB') : '—'}
                          </td>
                        </tr>
                      ))}
                      {grouped[status].length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-3 py-3 text-center text-xs text-gray-400">
                            No tasks
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
