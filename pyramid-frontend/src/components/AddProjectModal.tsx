'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Project } from '@/types/project';
import { Priority, PRIORITY_LABELS } from '@/types/task';

export function AddProjectModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (p: Project) => void;
}) {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<Priority>('no_priority');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const project = await apiFetch<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), priority, dueDate: dueDate || undefined }),
      });
      onCreated(project);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-surface p-5 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Add Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
          />

          <div>
            <label className="mb-1 block text-xs text-gray-500">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full rounded-md border border-gray-200 bg-transparent px-2 py-1.5 text-sm outline-none"
            >
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-500">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-transparent px-2 py-1.5 text-sm outline-none"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-full border border-gray-200 px-4 py-1.5 text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {submitting ? 'Adding…' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
