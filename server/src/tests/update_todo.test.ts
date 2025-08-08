import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { todosTable } from '../db/schema';
import { type UpdateTodoInput } from '../schema';
import { updateTodo } from '../handlers/update_todo';
import { eq } from 'drizzle-orm';

describe('updateTodo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  // Helper function to create a test todo
  const createTestTodo = async () => {
    const result = await db.insert(todosTable)
      .values({
        title: 'Original Todo',
        completed: false
      })
      .returning()
      .execute();
    
    return result[0];
  };

  it('should update todo title', async () => {
    const testTodo = await createTestTodo();
    
    const updateInput: UpdateTodoInput = {
      id: testTodo.id,
      title: 'Updated Todo Title'
    };

    const result = await updateTodo(updateInput);

    expect(result.id).toEqual(testTodo.id);
    expect(result.title).toEqual('Updated Todo Title');
    expect(result.completed).toEqual(false); // Should remain unchanged
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should update todo completed status', async () => {
    const testTodo = await createTestTodo();
    
    const updateInput: UpdateTodoInput = {
      id: testTodo.id,
      completed: true
    };

    const result = await updateTodo(updateInput);

    expect(result.id).toEqual(testTodo.id);
    expect(result.title).toEqual('Original Todo'); // Should remain unchanged
    expect(result.completed).toEqual(true);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should update both title and completed status', async () => {
    const testTodo = await createTestTodo();
    
    const updateInput: UpdateTodoInput = {
      id: testTodo.id,
      title: 'Both Fields Updated',
      completed: true
    };

    const result = await updateTodo(updateInput);

    expect(result.id).toEqual(testTodo.id);
    expect(result.title).toEqual('Both Fields Updated');
    expect(result.completed).toEqual(true);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save updated todo to database', async () => {
    const testTodo = await createTestTodo();
    
    const updateInput: UpdateTodoInput = {
      id: testTodo.id,
      title: 'Saved Update',
      completed: true
    };

    await updateTodo(updateInput);

    // Verify the change was persisted to database
    const todos = await db.select()
      .from(todosTable)
      .where(eq(todosTable.id, testTodo.id))
      .execute();

    expect(todos).toHaveLength(1);
    expect(todos[0].title).toEqual('Saved Update');
    expect(todos[0].completed).toEqual(true);
    expect(todos[0].created_at).toBeInstanceOf(Date);
  });

  it('should throw error when todo does not exist', async () => {
    const updateInput: UpdateTodoInput = {
      id: 999, // Non-existent ID
      title: 'This should fail'
    };

    await expect(updateTodo(updateInput)).rejects.toThrow(/todo with id 999 not found/i);
  });

  it('should handle partial updates correctly', async () => {
    const testTodo = await createTestTodo();
    
    // Update only title
    const titleOnlyInput: UpdateTodoInput = {
      id: testTodo.id,
      title: 'Only Title Changed'
    };

    const titleResult = await updateTodo(titleOnlyInput);
    expect(titleResult.title).toEqual('Only Title Changed');
    expect(titleResult.completed).toEqual(false); // Should remain original value

    // Update only completed status
    const completedOnlyInput: UpdateTodoInput = {
      id: testTodo.id,
      completed: true
    };

    const completedResult = await updateTodo(completedOnlyInput);
    expect(completedResult.title).toEqual('Only Title Changed'); // Should remain from previous update
    expect(completedResult.completed).toEqual(true);
  });

  it('should preserve created_at timestamp', async () => {
    const testTodo = await createTestTodo();
    const originalCreatedAt = testTodo.created_at;
    
    const updateInput: UpdateTodoInput = {
      id: testTodo.id,
      title: 'Updated Todo',
      completed: true
    };

    const result = await updateTodo(updateInput);

    expect(result.created_at).toEqual(originalCreatedAt);
  });

  it('should handle empty string title update', async () => {
    const testTodo = await createTestTodo();
    
    // Note: This test assumes the handler doesn't validate the title
    // If validation is added later, this test would need to be updated
    const updateInput: UpdateTodoInput = {
      id: testTodo.id,
      title: '' // Empty string
    };

    const result = await updateTodo(updateInput);
    expect(result.title).toEqual('');
    expect(result.completed).toEqual(false);
  });
});