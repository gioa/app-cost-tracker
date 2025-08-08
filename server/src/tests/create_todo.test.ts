import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { todosTable } from '../db/schema';
import { type CreateTodoInput } from '../schema';
import { createTodo } from '../handlers/create_todo';
import { eq, gte, between, and } from 'drizzle-orm';

// Simple test input
const testInput: CreateTodoInput = {
  title: 'Test Todo'
};

describe('createTodo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a todo with required fields', async () => {
    const result = await createTodo(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test Todo');
    expect(result.completed).toEqual(false);
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save todo to database', async () => {
    const result = await createTodo(testInput);

    // Query using proper drizzle syntax
    const todos = await db.select()
      .from(todosTable)
      .where(eq(todosTable.id, result.id))
      .execute();

    expect(todos).toHaveLength(1);
    expect(todos[0].title).toEqual('Test Todo');
    expect(todos[0].completed).toEqual(false);
    expect(todos[0].created_at).toBeInstanceOf(Date);
  });

  it('should create multiple todos with unique ids', async () => {
    const firstTodo = await createTodo({ title: 'First Todo' });
    const secondTodo = await createTodo({ title: 'Second Todo' });

    expect(firstTodo.id).not.toEqual(secondTodo.id);
    expect(firstTodo.title).toEqual('First Todo');
    expect(secondTodo.title).toEqual('Second Todo');

    // Verify both exist in database
    const allTodos = await db.select()
      .from(todosTable)
      .execute();

    expect(allTodos).toHaveLength(2);
  });

  it('should set completed to false by default', async () => {
    const result = await createTodo(testInput);

    expect(result.completed).toEqual(false);

    // Verify in database
    const dbTodo = await db.select()
      .from(todosTable)
      .where(eq(todosTable.id, result.id))
      .execute();

    expect(dbTodo[0].completed).toEqual(false);
  });

  it('should handle various title lengths', async () => {
    const shortTitle = await createTodo({ title: 'A' });
    const longTitle = await createTodo({ 
      title: 'This is a very long todo title that contains many characters and should still work correctly' 
    });

    expect(shortTitle.title).toEqual('A');
    expect(longTitle.title).toEqual('This is a very long todo title that contains many characters and should still work correctly');

    // Verify both are saved
    const todos = await db.select()
      .from(todosTable)
      .execute();

    expect(todos).toHaveLength(2);
  });

  it('should query todos by date range correctly', async () => {
    // Create test todo
    await createTodo(testInput);

    // Test date filtering - demonstration of correct date handling
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Apply date filter - Date objects work directly with timestamp columns
    const todos = await db.select()
      .from(todosTable)
      .where(and(
        gte(todosTable.created_at, yesterday),
        between(todosTable.created_at, yesterday, tomorrow)
      ))
      .execute();

    expect(todos.length).toBeGreaterThan(0);
    todos.forEach(todo => {
      expect(todo.created_at).toBeInstanceOf(Date);
      expect(todo.created_at >= yesterday).toBe(true);
      expect(todo.created_at <= tomorrow).toBe(true);
    });
  });

  it('should handle special characters in title', async () => {
    const specialTitleTodo = await createTodo({ 
      title: 'Todo with "quotes" & symbols: @#$%^&*()' 
    });

    expect(specialTitleTodo.title).toEqual('Todo with "quotes" & symbols: @#$%^&*()');

    // Verify in database
    const dbTodo = await db.select()
      .from(todosTable)
      .where(eq(todosTable.id, specialTitleTodo.id))
      .execute();

    expect(dbTodo[0].title).toEqual('Todo with "quotes" & symbols: @#$%^&*()');
  });

  it('should return proper Date object for created_at', async () => {
    const result = await createTodo(testInput);

    // Check type and properties of Date object
    expect(result.created_at).toBeInstanceOf(Date);
    expect(typeof result.created_at.getTime).toBe('function');
    expect(result.created_at.getTime()).toBeGreaterThan(0);

    // Check that the date is recent (within last minute)
    const now = new Date();
    const timeDiff = now.getTime() - result.created_at.getTime();
    expect(timeDiff).toBeLessThan(60000); // Less than 1 minute
  });
});