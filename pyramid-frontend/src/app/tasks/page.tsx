'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, ListFilter, Plus, MoreHorizontal, Columns3, List } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskModal } from '@/components/AddTaskModal';
import { apiFetch } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import {
  Task,
  TaskStatus,
  Priority,
  STATUS_LABELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
} from '@/types/task';

const COLUMNS: TaskStatus[] = ['to_do', 'doing', 'completed', 'on_hold'];
const PRIORITY_FILTERS: Priority[] = ['urgent', 'high', 'medium', 'low', 'no_priority'];


type VisibleFields = {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  membersSecondary: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
};

const FIELD_ITEMS: { key: keyof VisibleFields; label: string }[] = [
  { key: 'priority', label: 'Priority' },
  { key: 'members', label: 'Members' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'membersSecondary', label: 'Members' },
  { key: 'labels', label: 'Labels' },
  { key: 'status', label: 'Status' },
  { key: 'reporter', label: 'Reporter' },
];

export default function TasksPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'board' | 'list'>('board');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalStatus, setModalStatus] = useState<TaskStatus | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const [visibleFields, setVisibleFields] = useState<VisibleFields>({
    priority: false,
    members: true,
    dueDate: false,
    membersSecondary: true,
    labels: false,
    status: false,
    reporter: false,
  });

  const fieldsRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (priorityFilter) params.set('priority', priorityFilter);
    const qs = params.toString();
    setLoading(true);
    apiFetch<Task[]>(`/tasks${qs ? `?${qs}` : ''}`)
      .then(setTasks)
      .finally(() => setLoading(false));
  }, [search, priorityFilter, user]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (fieldsRef.current && !fieldsRef.current.contains(e.target as Node)) {
        setFieldsOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreated = (task: Task) => setTasks((prev) => [task, ...prev]);

  const handleDrop = async (status: TaskStatus, taskId: string) => {
    setDragOverColumn(null);
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    try {
      await apiFetch(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {
      apiFetch<Task[]>('/tasks').then(setTasks);
    }
  };

  const toggleField = (field: keyof VisibleFields) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const grouped = COLUMNS.reduce<Record<TaskStatus, Task[]>>((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const visibleColumnCount =
    2 +
    (visibleFields.priority ? 1 : 0) +
    (visibleFields.members || visibleFields.membersSecondary ? 1 : 0) +
    (visibleFields.dueDate ? 1 : 0);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted md:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-semibold">Tasks</h1>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-surface px-2 py-1.5">
              <Search size={14} className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-24 bg-transparent text-sm outline-none sm:w-32"
              />
            </div>

            <div className="relative" ref={fieldsRef}>
              <button
                onClick={() => {
                  setFieldsOpen((open) => !open);
                  setFilterOpen(false);
                }}
                className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-sm ${
                  fieldsOpen ? 'border-gray-300 text-gray-800' : 'border-gray-200 text-gray-500'
                } bg-surface`}
              >
                <Columns3 size={14} />
                <span>Fields</span>
              </button>

              {fieldsOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-72 rounded-lg border border-gray-100 bg-surface p-3 shadow-lg">
                  <div className="mb-3 flex rounded-md border border-gray-200 bg-surface-muted p-0.5 text-sm">
                    <button
                      onClick={() => setView('list')}
                      className={`flex-1 rounded px-2 py-1 ${
                        view === 'list' ? 'bg-surface font-medium' : 'text-gray-500'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <List size={14} />
                        List
                      </span>
                    </button>
                    <button
                      onClick={() => setView('board')}
                      className={`flex-1 rounded px-2 py-1 ${
                        view === 'board' ? 'bg-surface font-medium' : 'text-gray-500'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Columns3 size={14} />
                        Board
                      </span>
                    </button>
                  </div>

                  <div className="space-y-0.5">
                    {FIELD_ITEMS.map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => toggleField(key)}
                        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-surface-muted"
                      >
                        <span>{label}</span>
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded border text-xs ${
                            visibleFields[key]
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 bg-gray-100 text-transparent'
                          }`}
                        >
                          {visibleFields[key] && '✓'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={filterRef}>
              <button
                onClick={() => {
                  setFilterOpen((open) => !open);
                  setFieldsOpen(false);
                }}
                className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-sm ${
                  priorityFilter ? 'border-accent text-accent' : 'border-gray-200 text-gray-500'
                } bg-surface`}
              >
                <ListFilter size={14} />
                <span>{priorityFilter ? `Filter: ${PRIORITY_LABELS[priorityFilter]}` : 'Filter'}</span>
              </button>

              {filterOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-gray-100 bg-surface p-1 shadow-lg">
                  <button
                    onClick={() => {
                      setPriorityFilter(null);
                      setFilterOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-surface-muted"
                  >
                    All priorities {!priorityFilter && <span>✓</span>}
                  </button>
                  {PRIORITY_FILTERS.map((priority) => (
                    <button
                      key={priority}
                      onClick={() => {
                        setPriorityFilter(priority);
                        setFilterOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-surface-muted"
                    >
                      {PRIORITY_LABELS[priority]} {priorityFilter === priority && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setModalStatus('to_do')}
              className="flex items-center gap-1 rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white"
            >
              <Plus size={14} /> Add Task
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading tasks…</p>
        ) : view === 'board' ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {COLUMNS.map((status) => (
              <div
                key={status}
                className="w-64 shrink-0 sm:w-72"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverColumn(status);
                }}
                onDragLeave={() => setDragOverColumn(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  const taskId = e.dataTransfer.getData('text/plain');
                  if (taskId) handleDrop(status, taskId);
                }}
              >
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-sm font-medium text-gray-600">
                    {STATUS_LABELS[status]} <span className="text-gray-400">{grouped[status].length}</span>
                  </span>
                  <button
                    onClick={() => setModalStatus(status)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={`Add task to ${STATUS_LABELS[status]}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div
                  className={`min-h-[40px] space-y-2 rounded-card ${
                    dragOverColumn === status ? 'bg-accent/5 ring-1 ring-accent/30' : ''
                  }`}
                >
                  {grouped[status].map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', task._id)}
                    >
                      <TaskCard task={task} />
                    </div>
                  ))}

                  {grouped[status].length === 0 && (
                    <p className="rounded-card border border-dashed border-gray-200 p-3 text-center text-xs text-gray-400">
                      No tasks
                    </p>
                  )}

                  <button
                    onClick={() => setModalStatus(status)}
                    className="w-full rounded-card border border-dashed border-gray-200 p-2 text-center text-xs text-gray-400 hover:border-gray-300 hover:text-gray-600"
                  >
                    + Add Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {COLUMNS.map((status) => (
              <div key={status}>
                <p className="mb-1 text-sm font-medium text-gray-600">{STATUS_LABELS[status]}</p>
                <div className="overflow-x-auto rounded-card border border-gray-100 bg-surface">
                  <table className="w-full min-w-[700px] text-sm">
                    <thead className="border-b border-gray-100 text-left text-xs text-gray-400">
                      <tr>
                        <th className="px-3 py-2 font-normal">Task</th>
                        {visibleFields.priority && <th className="px-3 py-2 font-normal">Priority</th>}
                        {(visibleFields.members || visibleFields.membersSecondary) && (
                          <th className="px-3 py-2 font-normal">Members</th>
                        )}
                        {visibleFields.dueDate && <th className="px-3 py-2 font-normal">Due Date</th>}
                        <th className="px-3 py-2 text-right font-normal">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grouped[status].map((task) => (
                        <tr key={task._id} className="border-b border-gray-50 last:border-0">
                          <td className="px-3 py-2">
                            <a href={`/tasks/${task._id}`} className="font-medium hover:underline">
                              {task.title}
                            </a>
                          </td>

                          {visibleFields.priority && (
                            <td className={`px-3 py-2 ${PRIORITY_COLORS[task.priority]}`}>
                              {PRIORITY_LABELS[task.priority]}
                            </td>
                          )}

                          {(visibleFields.members || visibleFields.membersSecondary) && (
                            <td className="px-3 py-2">
                              <div className="flex items-center -space-x-2">
                                {task.members?.slice(0, 3).map((member) => (
                                  <div
                                    key={member._id}
                                    title={member.fullName}
                                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium text-gray-600"
                                  >
                                    {member.fullName.charAt(0).toUpperCase()}
                                  </div>
                                ))}
                                {task.members && task.members.length > 3 && (
                                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs text-gray-500">
                                    +{task.members.length - 3}
                                  </div>
                                )}
                                {(!task.members || task.members.length === 0) && (
                                  <span className="text-xs text-gray-400">—</span>
                                )}
                              </div>
                            </td>
                          )}

                          {visibleFields.dueDate && (
                            <td className="px-3 py-2 text-gray-500">
                              {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : '—'}
                            </td>
                          )}

                          <td className="px-3 py-2 text-right">
                            <a
                              href={`/tasks/${task._id}`}
                              className="inline-flex rounded-md p-1 text-gray-400 hover:bg-surface-muted hover:text-gray-700"
                              aria-label={`View ${task.title}`}
                            >
                              <MoreHorizontal size={16} />
                            </a>
                          </td>
                        </tr>
                      ))}

                      {grouped[status].length === 0 && (
                        <tr>
                          <td
                            colSpan={Math.max(visibleColumnCount, 1)}
                            className="px-3 py-3 text-center text-xs text-gray-400"
                          >
                            No tasks
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <button
                    onClick={() => setModalStatus(status)}
                    className="w-full border-t border-gray-100 p-2 text-center text-xs text-gray-400 hover:text-gray-600"
                  >
                    + Add Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modalStatus && (
        <AddTaskModal
          defaultStatus={modalStatus}
          onClose={() => setModalStatus(null)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
