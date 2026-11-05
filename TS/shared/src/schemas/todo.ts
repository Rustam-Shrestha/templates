import { z } from 'zod';
import { uuidSchema, isoDateTimeSchema, paginationQuerySchema } from './common.js';

export const todoSchema = z.object({
  id: uuidSchema,
  title: z.string().min(1).max(200),
  completed: z.boolean(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title cannot be empty' })
    .max(200, { message: 'Title cannot exceed 200 characters' }),
});

export const updateTodoSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { message: 'Title cannot be empty' })
      .max(200, { message: 'Title cannot exceed 200 characters' })
      .optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    (data) => data.title !== undefined || data.completed !== undefined,
    { message: 'At least one field (title or completed) must be provided' },
  );

export const todoListQuerySchema = paginationQuerySchema;

export const todoPageSchema = z.object({
  items: z.array(todoSchema),
  nextCursor: z.string().nullable(),
});

export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoListQuery = z.infer<typeof todoListQuerySchema>;
export type TodoPage = z.infer<typeof todoPageSchema>;

