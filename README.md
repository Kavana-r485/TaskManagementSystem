# Pyramid — Task Management System
Full Stack Developer (Fresher) Technical Assessment — AbleSpace

## Live Deployment
- **Frontend:** https://task-management-system-one-liart.vercel.app
- **Backend API:** https://pyramid-bqj7.onrender.com

> Note: the backend runs on Render's free tier, which spins down after ~15
> minutes of inactivity. The first request after idle time can take
> 30–50 seconds to respond while the service wakes up — this is expected,
> not a bug.

## Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS, TypeScript
- **Backend:** NestJS, TypeScript, class-validator for DTO validation
- **Database:** MongoDB (Mongoose) via MongoDB Atlas
- **Auth:** JWT, guest login
- **Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Running Locally
See `pyramid-backend/README.md` and `pyramid-frontend/README.md` for
per-project setup. Short version:
```bash
# backend
cd pyramid-backend
npm install
cp .env.example .env   # fill in MONGODB_URI + JWT_SECRET
npm run start:dev      # http://localhost:4000/api

# frontend (separate terminal)
cd pyramid-frontend
npm install
cp .env.local.example .env.local
npm run dev             # http://localhost:3000
```

## Features Implemented
- Guest login (JWT-based sessions), route protection on all authenticated pages
- Tasks: Board view (drag-and-drop between status columns) and List view, live search, priority Filter dropdown, Fields show/hide-columns dropdown
- Task detail: description, labels, subtasks (with Add Subtask), comments, inline editing of status/priority/due date, delete
- Projects: list + detail view with breadcrumb drill-down into a project's tasks
- Settings: Profile (editable name/title/username), Theme (Light/Dark), Color (6 accent options)
- Theme system: Light/Dark mode and accent color are independent, both persisted across sessions, no flash-of-unstyled-theme on load
- Responsive layout across all pages
- Clean NestJS module structure (Auth/Users/Tasks/Projects), DTO validation on every write endpoint

## Documented Deviations from the Figma Design
These are intentional scope decisions made to fit the assessment timeline,
not oversights:

1. **Google OAuth is not implemented.** The "Login with Google" button is
   present in the UI (matching the design) but disabled with an explanatory
   tooltip. Real Google login requires OAuth credentials from a Google Cloud
   project (client ID/secret, consent screen, redirect URIs) that need to be
   provisioned outside of this codebase. Guest login is fully functional and
   was prioritized instead.
2. **The Fields dropdown's duplicated "Members" row is intentional**, not a
   bug — it's present twice in the source Figma file. Both checkboxes are
   independently wired; either one being checked shows the Members column
   in List view.
3. **No separate "Updates"/activity log distinct from comments.** The
   design's task detail sidebar implies both a comment thread and an
   activity feed; only the comment thread is implemented, since it covers
   the core collaboration need within the time available.
4. **Drag-and-drop is implemented on the Board view** (not explicitly
   required by the assignment, but included since the design clearly
   implies a Kanban board) — dragging a card to another column updates its
   status via the API immediately.
5. **Subtask fields aren't editable inline from the parent task's subtask
   table** — click into a subtask's own detail page to edit its status,
   priority, or due date.

