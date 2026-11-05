# Phase 1: Root Tooling Setup

## Files to Create / Configure

- `package.json` (Root workspaces: `shared`, `backend`, `frontend`)
- `turbo.json` (Pipelines for build, typecheck, lint, test, dev)
- `tsconfig.base.json` (NodeNext, strict, verbatimModuleSyntax)
- `eslint.config.js` (Flat config with `@eslint/js`, `typescript-eslint`, globals)
- `.prettierrc`, `.prettierignore`, `.editorconfig`, `.gitignore`, `.nvmrc`, `.npmrc`
- `shared/package.json`, `backend/package.json`, `frontend/package.json`

## Actions

1. Run `npm install` to create reproducible `package-lock.json`.
2. Format repository with Prettier.

## Acceptance Criteria

- `npm install` completes cleanly with 0 vulnerabilities.
- `npx prettier --check .` passes without errors.
