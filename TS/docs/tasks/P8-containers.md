# Phase 8: Containers & Delivery

## Files to Create

- `backend/Dockerfile` (Multi-stage Node 24 slim build)
- `backend/.dockerignore`
- `frontend/Dockerfile` (Multi-stage build with nginx-unprivileged)
- `frontend/nginx.conf` (CSP headers, reverse proxy `/api` -> backend, SPA fallback)
- `frontend/.dockerignore`
- `docker-compose.yml` (Orchestrates `db`, `api`, `web`)

## Acceptance Criteria

- Docker build succeeds for both backend and frontend.
- `docker compose config` validates clean configuration syntax.
