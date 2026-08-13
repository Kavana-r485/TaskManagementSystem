# Pyramid Backend (NestJS)

## Setup
```bash
npm install  
npm run start:dev
```
API runs at `http://localhost:4000/api`.

## Auth
- `POST /api/auth/guest` — creates a guest user, returns `{ accessToken, user }`.
  Frontend stores `accessToken` (e.g. in a cookie or memory + refresh on load)
  and sends `Authorization: Bearer <token>` on every request below.

## Users
- `GET /api/users/me` — current user's profile
- `PATCH /api/users/me` — update `fullName`, `title`, `username`

## Tasks
- `POST /api/tasks` — create task (title required; status/priority default to `to_do` / `no_priority`)
- `GET /api/tasks?status=&priority=&project=&search=` — list top-level tasks (used by both Board and List views — group by `status` client-side for the board)
- `GET /api/tasks/:id` — task detail (populates members, reporter, comment authors)
- `GET /api/tasks/:id/subtasks` — subtasks of a task
- `PATCH /api/tasks/:id` — update any field (drag-and-drop on the board = PATCH `status`)
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/comments` — add a comment

To create a subtask, `POST /api/tasks` with `parentTask: "<parent id>"`.

## Projects
- `POST /api/projects`, `GET /api/projects`, `GET /api/projects/:id`, `PATCH /api/projects/:id`, `DELETE /api/projects/:id`
- Filter tasks by project via `GET /api/tasks?project=<id>` for the breadcrumb drill-down view.

## Status / Priority enums
- Task status: `to_do | doing | completed | on_hold`
- Priority (tasks & projects): `no_priority | urgent | high | medium | low`

## What's implemented vs scoped out
- Guest login only — Google OAuth is not wired up. 
- Fields show/hide and multi-field Filter dropdowns from the design aren't backed by query params beyond status/priority/project/search.
- Activity/"Updates" log (distinct from comments) isn't implemented — comments alone are.
