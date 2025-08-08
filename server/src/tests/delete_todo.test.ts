import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { todosTable } from '../db/schema';
import { type DeleteTodoInput } from '../schema';
import { deleteTodo } from '../handlers/delete_todo';
import { eq } from 'drizzle-orm';

describe('deleteTodo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should successfully delete an existing todo', async () => {
    // Create a test todo first
    const testTodo = await db.insert(todosTable)
      .values({
        title: 'Test Todo to Delete',
        completed: false
      })
      .returning()
      .execute();

    const todoId = testTodo[0].id;
    const input: DeleteTodoInput = { id: todoId };

    // Delete the todo
    const result = await deleteTodo(input);

    // Verify successful deletion
    expect(result.success).toBe(true);

    // Verify todo is actually deleted from database
    const remainingTodos = await db.select()
      .from(todosTable)
      .where(eq(todosTable.id, todoId))
      .execute();

    expect(remainingTodos).toHaveLength(0);
  });

  it('should return success false when deleting non-existent todo', async () => {
    const nonExistentId = 99999;
    const input: DeleteTodoInput = { id: nonExistentId };

    const result = await deleteTodo(input);

    expect(result.success).toBe(false);
  });

  it('should not affect other todos when deleting one', async () => {
    // Create multiple test todos
    const todos = await db.insert(todosTable)
      .values([
        { title: 'Todo 1', completed: false },
        { title: 'Todo 2', completed: true },
        { title: 'Todo to Delete', completed: false }
      ])
      .returning()
      .execute();

    const todoToDeleteId = todos[2].id;
    const input: DeleteTodoInput = { id: todoToDeleteId };

    // Delete the specific todo
    const result = await deleteTodo(input);

    expect(result.success).toBe(true);

    // Verify other todos still exist
    const remainingTodos = await db.select()
      .from(todosTable)
      .execute();

    expect(remainingTodos).toHaveLength(2);
    expect(remainingTodos.map(t => t.title)).toEqual(['Todo 1', 'Todo 2']);
  });

  it('should handle completed todos deletion correctly', async () => {
    // Create a completed todo
    const completedTodo = await db.insert(todosTable)
      .values({
        title: 'Completed Todo',
        completed: true
      })
      .returning()
      .execute();

    const input: DeleteTodoInput = { id: completedTodo[0].id };

    const result = await deleteTodo(input);

    expect(result.success).toBe(true);

    // Verify deletion
    const todos = await db.select()
      .from(todosTable)
      .where(eq(todosTable.id, completedTodo[0].id))
      .execute();

    expect(todos).toHaveLength(0);
  });

  it('should handle zero id correctly', async () => {
    const input: DeleteTodoInput = { id: 0 };

    const result = await deleteTodo(input);

    expect(result.success).toBe(false);
  });

  it('should handle negative id correctly', async () => {
    const input: DeleteTodoInput = { id: -1 };

    const result = await deleteTodo(input);

    expect(result.success).toBe(false);
  });
});