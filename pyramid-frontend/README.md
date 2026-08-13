# Pyramid Frontend (Next.js)

## Setup
```bash
npm install
npm run dev
```
Requires the `pyramid-backend` API running (default `http://localhost:4000/api`).

## Latest change: Add Subtask
`AddTaskModal` now accepts an optional `parentTask` prop. On the task detail
page (`/tasks/[id]`), a "+ Add Subtask" button opens the same modal (heading
and submit button relabel to "Add Subtask"), POSTs with `parentTask` set to
the current task's id, and the new subtask is appended to the subtasks table
immediately without a full page refetch.

## What's built
- Login, guest auth, JWT-protected routes (`useRequireAuth`)
- Theme system — Light/Dark + 6 accent colors, persisted independently
- Tasks — Board (drag-and-drop between columns) and List view, live search,
  working Filter (by priority) and Fields (show/hide columns) dropdowns
- Add Task modal, Task detail page (subtasks + Add Subtask, comments,
  inline status/priority/due-date edit, delete)
- Projects list + detail (breadcrumb, scoped tasks)
- Settings — Profile / Theme / Color tabs
- Responsive layout across all pages

## Deliberately out of scope
- Google OAuth — button present but disabled; needs real Google Cloud
  credentials only you can create. Document as a deviation.
- Activity/"Updates" log distinct from comments
- Editing subtask fields inline from the parent's table (click through to
  the subtask's own detail page to edit it)

## Notes
- `apiFetch()` in `src/lib/api.ts` attaches the JWT on every request.
- `useRequireAuth()` in `src/hooks/useRequireAuth.ts` — use on any new protected page.
