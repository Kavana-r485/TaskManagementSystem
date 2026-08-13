import { Task, PRIORITY_COLORS } from '@/types/task';
import Link from 'next/link';

export function TaskCard({ task }: { task: Task }) {
  return (
    <Link
      href={`/tasks/${task._id}`}
      className="block rounded-card border border-gray-100 bg-surface p-3 shadow-sm transition hover:shadow-md"
    >
      <p className="text-sm font-medium">{task.title}</p>

      <div className="mt-2 flex items-center gap-2">
        <span className="h-5 w-5 rounded-full bg-gradient-to-br from-accent to-purple-400" />
        {task.dueDate && (
          <span className="rounded bg-red-50 px-1.5 py-0.5 text-xs text-red-500">
            {new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
          </span>
        )}
      </div>

      {task.labels?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.labels.map((l) => (
            <span key={l} className="rounded bg-surface-muted px-1.5 py-0.5 text-xs text-gray-500">
              {l}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
