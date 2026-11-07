# Frontend Feature-Sliced Design (FSD) Rituals

1. **Unidirectional Imports:** `app` -> `features` -> `shared` -> `@workspace/*`.
2. **Strict Feature Isolation:** A feature inside `src/features/A` can NEVER import from `src/features/B`. Compose them at the `src/app/` page level.
3. **Contract-Driven Networking:** Every network call must use `fetchWithContract` and validate the payload against a Zod schema from `@workspace/contracts`. Direct calls to `fetch()` are strictly forbidden by ESLint.
4. **Server vs. Client Boundaries:** Keep `layout.tsx` and `page.tsx` as Server Components. Only place `"use client"` on interactive leafs.
5. **No Bracketed Browser Env Access:** Access client environment variables strictly via validated literal access in `shared/api/env.ts`.

