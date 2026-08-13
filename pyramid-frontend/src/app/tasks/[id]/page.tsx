'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { AddTaskModal } from '@/components/AddTaskModal';
import { apiFetch } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Task, Priority, PRIORITY_LABELS, STATUS_LABELS, TaskStatus } from '@/types/task';

interface Comment {
  _id?: string;
  author: { fullName: string } | string;
  text: string;
  createdAt: string;
}

export default function TaskDetailPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<(Task & { comments?: Comment[] }) | null>(null);
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      apiFetch<Task & { comments?: Comment[] }>(`/tasks/${id}`),
      apiFetch<Task[]>(`/tasks/${id}/subtasks`),
    ])
      .then(([t, subs]) => {
        setTask(t);
        setSubtasks(subs);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id && user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const updateField = async (patch: Partial<Task>) => {
    if (!task) return;
    const updated = await apiFetch<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    setTask((prev) => (prev ? { ...prev, ...updated } : updated));
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    setPosting(true);
    try {
      const updated = await apiFetch<Task & { comments?: Comment[] }>(`/tasks/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text: commentText.trim() }),
      });
      setTask(updated);
      setCommentText('');
    } finally {
      setPosting(false);
    }
  };

  const deleteTask = async () => {
    if (!confirm('Delete this task?')) return;
    await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
    router.push('/tasks');
  };

  if (authLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-400">Loading…</div>;
  }

  if (loading || !task) {
    return (
      <div className="flex min-h-screen bg-surface-muted">
        <Sidebar />
        <main className="flex-1 p-6 text-sm text-gray-400">Loading…</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted md:flex-row">
      <Sidebar />

      <main className="flex flex-1 flex-col gap-6 p-4 md:flex-row md:p-6">
        {/* Main column */}
        <div className="flex-1 rounded-card border border-gray-100 bg-surface p-5">
          <div className="mb-1 flex items-start justify-between">
            <h1 className="text-lg font-semibold">{task.title}</h1>
            <button onClick={deleteTask} className="text-xs text-red-400 hover:text-red-600">
              Delete
            </button>
          </div>
          {task.description && <p className="mt-1 text-sm text-gray-500">{task.description}</p>}

          {task.labels?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {task.labels.map((l) => (
                <span key={l} className="rounded bg-surface-muted px-2 py-0.5 text-xs text-gray-500">
                  {l}
                </span>
              ))}
            </div>
          )}

          {/* Subtasks */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">Subtasks</p>
              <button
                onClick={() => setShowSubtaskModal(true)}
                className="text-xs font-medium text-accent hover:underline"
              >
                + Add Subtask
              </button>
            </div>
            {subtasks.length === 0 ? (
              <p className="text-xs text-gray-400">No subtasks yet.</p>
            ) : (
              <div className="overflow-hidden rounded-card border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-100 text-left text-xs text-gray-400">
                    <tr>
                      <th className="px-3 py-2 font-normal">Task</th>
                      <th className="px-3 py-2 font-normal">Priority</th>
                      <th className="px-3 py-2 font-normal">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subtasks.map((s) => (
                      <tr key={s._id} className="border-b border-gray-50 last:border-0">
                        <td className="px-3 py-2">
                          <a href={`/tasks/${s._id}`} className="hover:underline">{s.title}</a>
                        </td>
                        <td className="px-3 py-2">{PRIORITY_LABELS[s.priority]}</td>
                        <td className="px-3 py-2 text-gray-500">
                          {s.dueDate ? new Date(s.dueDate).toLocaleDateString('en-GB') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-gray-600">Comments</p>
            <div className="space-y-3">
              {(task.comments || []).map((c, i) => (
                <div key={c._id || i} className="flex gap-2">
                  <span className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-accent to-purple-400" />
                  <div>
                    <p className="text-xs text-gray-400">
                      {typeof c.author === 'string' ? 'User' : c.author.fullName} ·{' '}
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addComment()}
                placeholder="Add a comment…"
                className="flex-1 rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <button
                onClick={addComment}
                disabled={posting}
                className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Details sidebar */}
        <aside className="w-full shrink-0 rounded-card border border-gray-100 bg-surface p-4 md:w-64">
          <p className="mb-3 text-sm font-medium text-gray-600">Details</p>

          <div className="space-y-3 text-sm">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Status</label>
              <select
                value={task.status}
                onChange={(e) => updateField({ status: e.target.value as TaskStatus })}
                className="w-full rounded-md border border-gray-200 bg-transparent px-2 py-1.5 text-sm outline-none"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-400">Priority</label>
              <select
                value={task.priority}
                onChange={(e) => updateField({ priority: e.target.value as Priority })}
                className="w-full rounded-md border border-gray-200 bg-transparent px-2 py-1.5 text-sm outline-none"
              >
                {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-400">Due date</label>
              <input
                type="date"
                value={task.dueDate ? task.dueDate.slice(0, 10) : ''}
                onChange={(e) => updateField({ dueDate: e.target.value })}
                className="w-full rounded-md border border-gray-200 bg-transparent px-2 py-1.5 text-sm outline-none"
              />
            </div>
          </div>
        </aside>
      </main>

      {showSubtaskModal && (
        <AddTaskModal
          parentTask={task._id}
          defaultStatus="to_do"
          onClose={() => setShowSubtaskModal(false)}
          onCreated={(newSubtask) => setSubtasks((prev) => [...prev, newSubtask])}
        />
      )}
    </div>
  );
}
