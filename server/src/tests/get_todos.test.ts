import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { todosTable } from '../db/schema';
import { getTodos } from '../handlers/get_todos';

describe('getTodos', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no todos exist', async () => {
    const result = await getTodos();
    
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should return all todos ordered by creation date (newest first)', async () => {
    // Create test todos with slight time delays to ensure different timestamps
    const firstTodo = await db.insert(todosTable)
      .values({
        title: 'First Todo',
        completed: false
      })
      .returning()
      .execute();

    // Add a small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    const secondTodo = await db.insert(todosTable)
      .values({
        title: 'Second Todo', 
        completed: true
      })
      .returning()
      .execute();

    await new Promise(resolve => setTimeout(resolve, 10));

    const thirdTodo = await db.insert(todosTable)
      .values({
        title: 'Third Todo',
        completed: false
      })
      .returning()
      .execute();

    const result = await getTodos();

    // Should return 3 todos
    expect(result).toHaveLength(3);

    // Should be ordered by creation date (newest first)
    expect(result[0].title).toEqual('Third Todo');
    expect(result[1].title).toEqual('Second Todo');
    expect(result[2].title).toEqual('First Todo');

    // Verify all expected fields are present
    result.forEach(todo => {
      expect(todo.id).toBeDefined();
      expect(typeof todo.title).toBe('string');
      expect(typeof todo.completed).toBe('boolean');
      expect(todo.created_at).toBeInstanceOf(Date);
    });
  });

  it('should return todos with correct data types and structure', async () => {
    // Create a single test todo
    await db.insert(todosTable)
      .values({
        title: 'Test Todo',
        completed: true
      })
      .execute();

    const result = await getTodos();

    expect(result).toHaveLength(1);
    
    const todo = result[0];
    expect(typeof todo.id).toBe('number');
    expect(typeof todo.title).toBe('string');
    expect(typeof todo.completed).toBe('boolean');
    expect(todo.created_at).toBeInstanceOf(Date);
    
    // Verify specific values
    expect(todo.title).toEqual('Test Todo');
    expect(todo.completed).toBe(true);
  });

  it('should handle multiple todos with different completion states', async () => {
    // Create todos with different completion states
    const todos = [
      { title: 'Completed Todo 1', completed: true },
      { title: 'Pending Todo 1', completed: false },
      { title: 'Completed Todo 2', completed: true },
      { title: 'Pending Todo 2', completed: false }
    ];

    // Insert todos sequentially to ensure order
    for (const todo of todos) {
      await db.insert(todosTable).values(todo).execute();
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const result = await getTodos();

    expect(result).toHaveLength(4);
    
    // Verify all todos are returned regardless of completion state
    const completedCount = result.filter(todo => todo.completed).length;
    const pendingCount = result.filter(todo => !todo.completed).length;
    
    expect(completedCount).toBe(2);
    expect(pendingCount).toBe(2);

    // Verify ordering (newest first) - last inserted should be first
    expect(result[0].title).toEqual('Pending Todo 2');
    expect(result[1].title).toEqual('Completed Todo 2');
    expect(result[2].title).toEqual('Pending Todo 1');
    expect(result[3].title).toEqual('Completed Todo 1');
  });

  it('should maintain consistent ordering across multiple calls', async () => {
    // Create test data
    await db.insert(todosTable)
      .values([
        { title: 'Todo A', completed: false },
        { title: 'Todo B', completed: true },
        { title: 'Todo C', completed: false }
      ])
      .execute();

    // Call getTodos multiple times
    const firstCall = await getTodos();
    const secondCall = await getTodos();
    const thirdCall = await getTodos();

    // Results should be identical across calls
    expect(firstCall).toEqual(secondCall);
    expect(secondCall).toEqual(thirdCall);
    
    // All calls should return 3 todos
    expect(firstCall).toHaveLength(3);
    expect(secondCall).toHaveLength(3);
    expect(thirdCall).toHaveLength(3);
  });

  it('should handle todos with various title lengths', async () => {
    const testTodos = [
      { title: 'A', completed: false }, // Single character
      { title: 'Short todo', completed: true }, // Short title
      { title: 'This is a much longer todo title that contains more text', completed: false }, // Long title
      { title: '', completed: true } // Empty title (if allowed by schema)
    ];

    for (const todo of testTodos) {
      await db.insert(todosTable).values(todo).execute();
      await new Promise(resolve => setTimeout(resolve, 5));
    }

    const result = await getTodos();
    
    expect(result).toHaveLength(4);
    
    // Verify all titles are preserved
    const titles = result.map(todo => todo.title);
    expect(titles).toContain('A');
    expect(titles).toContain('Short todo');
    expect(titles).toContain('This is a much longer todo title that contains more text');
    expect(titles).toContain('');
  });
});