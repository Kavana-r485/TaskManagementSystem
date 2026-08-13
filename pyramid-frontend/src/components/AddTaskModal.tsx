'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Task, TaskStatus, Priority, STATUS_LABELS, PRIORITY_LABELS } from '@/types/task';

interface AddTaskModalProps {
  defaultStatus?: TaskStatus;
  parentTask?: string; // when set, this creates a subtask instead of a top-level task
  onClose: () => void;
  onCreated: (task: Task) => void;
}

export function AddTaskModal({ defaultStatus = 'to_do', parentTask, onClose, onCreated }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<Priority>('no_priority');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const task = await apiFetch<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          dueDate: dueDate || undefined,
          parentTask: parentTask || undefined,
        }),
      });
      onCreated(task);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-surface p-5 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{parentTask ? 'Add Subtask' : 'Add Task'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full resize-none rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-md border border-gray-200 bg-transparent px-2 py-1.5 text-sm outline-none"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

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
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 px-4 py-1.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {submitting ? 'Adding…' : parentTask ? 'Add Subtask' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
