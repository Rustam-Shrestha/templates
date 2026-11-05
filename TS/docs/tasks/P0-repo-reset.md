# Phase 0: Repository Reset & Cleanup

## Steps

1. Delete legacy `backend-fastapi/` directory.
2. Clean `backend/dist/` and `backend/node_modules/`.
3. Rename `backend-node/` to `backend/`.
4. Clean `frontend/dist/`, `frontend/node_modules/`, `frontend/tailwind.config.cjs`, `frontend/postcss.config.cjs`, `frontend/agent/`.
5. Remove nested `package-lock.json` files.
6. Empty old legacy assets/components in `frontend/src/` to prepare for clean Vite + React 19 structure.

## Acceptance Criteria

- `git status` shows only deletions, renames, and clean working tree.
- No `dist/` or `node_modules/` tracked.
