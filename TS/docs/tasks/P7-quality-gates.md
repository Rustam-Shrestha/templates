# Phase 7: Quality Gates & CI

## Files to Create

- `.github/workflows/ci.yml` (Install, Lint, Typecheck, Test, Build, E2E jobs)
- `.github/dependabot.yml`

## Acceptance Criteria

- Full pipeline gates pass locally: `npm run lint && npm run typecheck && npm test && npm run build`.
- Zero audit vulnerabilities with high or critical severity.
