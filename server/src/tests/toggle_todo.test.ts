import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { todosTable } from '../db/schema';
import { type ToggleTodoInput } from '../schema';
import { toggleTodo } from '../handlers/toggle_todo';
import { eq } from 'drizzle-orm';

describe('toggleTodo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should toggle todo from incomplete to complete', async () => {
    // Create a todo that is not completed
    const created = await db.insert(todosTable)
      .values({
        title: 'Test Todo',
        completed: false
      })
      .returning()
      .execute();

    const testInput: ToggleTodoInput = {
      id: created[0].id
    };

    const result = await toggleTodo(testInput);

    // Verify the todo is now completed
    expect(result.id).toEqual(created[0].id);
    expect(result.title).toEqual('Test Todo');
    expect(result.completed).toBe(true);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should toggle todo from complete to incomplete', async () => {
    // Create a todo that is completed
    const created = await db.insert(todosTable)
      .values({
        title: 'Completed Todo',
        completed: true
      })
      .returning()
      .execute();

    const testInput: ToggleTodoInput = {
      id: created[0].id
    };

    const result = await toggleTodo(testInput);

    // Verify the todo is now incomplete
    expect(result.id).toEqual(created[0].id);
    expect(result.title).toEqual('Completed Todo');
    expect(result.completed).toBe(false);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save toggle changes to database', async () => {
    // Create a todo that is not completed
    const created = await db.insert(todosTable)
      .values({
        title: 'Database Test Todo',
        completed: false
      })
      .returning()
      .execute();

    const testInput: ToggleTodoInput = {
      id: created[0].id
    };

    await toggleTodo(testInput);

    // Query database to verify the change was persisted
    const todos = await db.select()
      .from(todosTable)
      .where(eq(todosTable.id, created[0].id))
      .execute();

    expect(todos).toHaveLength(1);
    expect(todos[0].completed).toBe(true);
    expect(todos[0].title).toEqual('Database Test Todo');
  });

  it('should handle multiple toggles correctly', async () => {
    // Create a todo
    const created = await db.insert(todosTable)
      .values({
        title: 'Multi Toggle Todo',
        completed: false
      })
      .returning()
      .execute();

    const testInput: ToggleTodoInput = {
      id: created[0].id
    };

    // First toggle: incomplete -> complete
    const firstToggle = await toggleTodo(testInput);
    expect(firstToggle.completed).toBe(true);

    // Second toggle: complete -> incomplete
    const secondToggle = await toggleTodo(testInput);
    expect(secondToggle.completed).toBe(false);

    // Third toggle: incomplete -> complete
    const thirdToggle = await toggleTodo(testInput);
    expect(thirdToggle.completed).toBe(true);

    // Verify final state in database
    const todos = await db.select()
      .from(todosTable)
      .where(eq(todosTable.id, created[0].id))
      .execute();

    expect(todos[0].completed).toBe(true);
  });

  it('should throw error when todo does not exist', async () => {
    const testInput: ToggleTodoInput = {
      id: 999 // Non-existent ID
    };

    await expect(() => toggleTodo(testInput)).toThrow(/Todo with id 999 not found/i);
  });

  it('should preserve other todo fields when toggling', async () => {
    // Create a todo with specific values
    const created = await db.insert(todosTable)
      .values({
        title: 'Important Task',
        completed: false
      })
      .returning()
      .execute();

    const originalCreatedAt = created[0].created_at;
    const testInput: ToggleTodoInput = {
      id: created[0].id
    };

    const result = await toggleTodo(testInput);

    // Verify all other fields remain unchanged
    expect(result.id).toEqual(created[0].id);
    expect(result.title).toEqual('Important Task');
    expect(result.created_at).toEqual(originalCreatedAt);
    expect(result.completed).toBe(true); // Only this should change
  });

  it('should work with todos that have default completion status', async () => {
    // Create a todo using default completed value (should be false)
    const created = await db.insert(todosTable)
      .values({
        title: 'Default Status Todo'
        // completed field omitted - should default to false
      })
      .returning()
      .execute();

    // Verify it starts as incomplete
    expect(created[0].completed).toBe(false);

    const testInput: ToggleTodoInput = {
      id: created[0].id
    };

    const result = await toggleTodo(testInput);

    // Should toggle to completed
    expect(result.completed).toBe(true);
  });
});