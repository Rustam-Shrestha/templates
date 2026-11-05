# Phase 6: Frontend Todos Feature

## Files to Create

- `frontend/src/features/todos/api.ts` (Typed API calls using `apiFetch` and `@app/shared` schemas)
- `frontend/src/features/todos/queries.ts` (TanStack Query hooks: `useTodosInfinite`, `useCreateTodo`, `useToggleTodo`, `useDeleteTodo` with optimistic updates and rollbacks)
- `frontend/src/features/todos/components/TodoForm.tsx` (React Hook Form + Zod resolver)
- `frontend/src/features/todos/components/TodoItem.tsx` (Toggle checkbox, title, delete button)
- `frontend/src/features/todos/components/TodoList.tsx` (Keyset infinite list with load more trigger)
- `frontend/src/features/todos/components/TodoEmpty.tsx`
- `frontend/src/features/todos/components/DeleteConfirmDialog.tsx`
- `frontend/src/features/todos/routes/TodosPage.tsx`
- `frontend/src/features/todos/todos.test.tsx`

## Acceptance Criteria

- Full CRUD operations with optimistic caching and rollback on failure.
- Unit/component test suite passes cleanly with MSW mocking.
- `npm run test -w frontend` passes.
