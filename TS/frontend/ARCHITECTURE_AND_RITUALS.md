# Frontend Architecture & Coding Rituals

## Core Principle: Feature-Sliced Design
This project scales to thousands of modules by strictly controlling dependencies. Code flows inwards. 
`app` -> `pages` -> `features` -> `shared`. 
**CRITICAL**: A `feature` can NEVER import from another `feature`. A `shared` module can NEVER import from a `feature`.

## Casing Rituals
- **Directories**: `kebab-case` (e.g., `user-profile/`)
- **Components**: `PascalCase.tsx` (e.g., `SubmitButton.tsx`)
- **Hooks/Utils/Logic**: `camelCase.ts` (e.g., `useAuth.ts`, `formatDate.ts`)
- **Types/Interfaces**: `PascalCase.ts` (e.g., `UserType.ts`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`)

## File Rituals
1. **Colocation**: Put tests, types, and styles next to the component (`Button.tsx`, `Button.test.tsx`, `Button.types.ts`).
2. **Index Exports**: Use `index.ts` in folders to expose a public API (Barrel pattern). Do not expose internal implementations.
3. **No Default Exports**: Use named exports exclusively for predictable refactoring and better IDE support. React lazy-loaded pages are the ONLY exception.

