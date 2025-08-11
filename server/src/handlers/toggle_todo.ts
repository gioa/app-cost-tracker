import { db } from '../db';
import { todosTable } from '../db/schema';
import { eq, not } from 'drizzle-orm';
import { type ToggleTodoInput, type Todo } from '../schema';

export const toggleTodo = async (input: ToggleTodoInput): Promise<Todo> => {
  try {
    // First get the current todo to toggle its completion status
    const currentTodo = await db.select()
      .from(todosTable)
      .where(eq(todosTable.id, input.id))
      .execute();

    if (currentTodo.length === 0) {
      throw new Error(`Todo with id ${input.id} not found`);
    }

    // Toggle the completed status
    const result = await db.update(todosTable)
      .set({ completed: !currentTodo[0].completed })
      .where(eq(todosTable.id, input.id))
      .returning()
      .execute();

    const todo = result[0];
    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      created_at: todo.created_at
    };
  } catch (error) {
    console.error('Todo toggle failed:', error);
    throw error;
  }
};