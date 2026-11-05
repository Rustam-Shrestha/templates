import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createTodoSchema,
  updateTodoSchema,
  todoListQuerySchema,
  todoSchema,
} from '../dist/index.js';

describe('Shared Schemas', () => {
  it('rejects empty title in createTodoSchema', () => {
    const result = createTodoSchema.safeParse({ title: '' });
    assert.strictEqual(result.success, false);
  });

  it('rejects whitespace-only title in createTodoSchema', () => {
    const result = createTodoSchema.safeParse({ title: '    ' });
    assert.strictEqual(result.success, false);
  });

  it('rejects title longer than 200 characters in createTodoSchema', () => {
    const result = createTodoSchema.safeParse({ title: 'a'.repeat(201) });
    assert.strictEqual(result.success, false);
  });

  it('accepts valid title and trims whitespace', () => {
    const result = createTodoSchema.safeParse({ title: '  Buy groceries  ' });
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.title, 'Buy groceries');
    }
  });

  it('rejects empty object in updateTodoSchema', () => {
    const result = updateTodoSchema.safeParse({});
    assert.strictEqual(result.success, false);
  });

  it('accepts partial update with title or completed', () => {
    const titleOnly = updateTodoSchema.safeParse({ title: 'New title' });
    assert.strictEqual(titleOnly.success, true);

    const completedOnly = updateTodoSchema.safeParse({ completed: true });
    assert.strictEqual(completedOnly.success, true);
  });

  it('validates todoListQuerySchema defaults and bounds', () => {
    const defaultQuery = todoListQuerySchema.parse({});
    assert.strictEqual(defaultQuery.limit, 20);
    assert.strictEqual(defaultQuery.cursor, undefined);

    const customQuery = todoListQuerySchema.parse({ limit: '50', cursor: 'abc' });
    assert.strictEqual(customQuery.limit, 50);
    assert.strictEqual(customQuery.cursor, 'abc');

    const invalidLimit = todoListQuerySchema.safeParse({ limit: 0 });
    assert.strictEqual(invalidLimit.success, false);
  });

  it('validates full todo item shape', () => {
    const validTodo = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Valid Todo',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = todoSchema.safeParse(validTodo);
    assert.strictEqual(result.success, true);
  });
});
