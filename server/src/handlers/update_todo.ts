import { db } from '../db';
import { todosTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type UpdateTodoInput, type Todo } from '../schema';

export const updateTodo = async (input: UpdateTodoInput): Promise<Todo> => {
  try {
    // Build update object with only provided fields
    const updateData: Partial<{ title: string; completed: boolean }> = {};
    
    if (input.title !== undefined) {
      updateData.title = input.title;
    }
    
    if (input.completed !== undefined) {
      updateData.completed = input.completed;
    }

    const result = await db.update(todosTable)
      .set(updateData)
      .where(eq(todosTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Todo with id ${input.id} not found`);
    }

    const todo = result[0];
    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      created_at: todo.created_at
    };
  } catch (error) {
    console.error('Todo update failed:', error);
    throw error;
  }
};