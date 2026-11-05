# Backend Architecture & Coding Rituals

## Core Principle: Modular Monolith
The backend is partitioned into independent domains (`src/modules/`). 
**CRITICAL**: Modules must not directly import from other modules' internal files. If `orders` needs `users` data, it must call a public method exported via the `users/index.ts` interface, or use event-based pub/sub.

## Casing Rituals
- **Directories**: `kebab-case` (e.g., `payment-processing/`)
- **Classes/Interfaces**: `PascalCase.ts` (e.g., `UserService.ts`)
- **Functions/Instances**: `camelCase.ts` (e.g., `logger.ts`, `authMiddleware.ts`)
- **DB Migrations**: `[timestamp]-kebab-case.ts`

## File Rituals
1. **Validation at Boundaries**: Every controller MUST validate incoming payload using Zod before passing it to a service. NEVER trust client data.
2. **Thin Controllers, Fat Services**: Controllers only handle HTTP (req/res) and validation. Services handle pure business logic. Repositories handle database interactions.
3. **Error Handling**: NEVER `console.log`. Use the structured `logger`. Throw custom AppErrors, let the global error middleware catch and format them to HTTP responses.
4. **No Magic Strings**: All environment variables must be validated on startup and exported from `core/config`.

