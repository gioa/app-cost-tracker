import { db } from '../db';
import { todosTable } from '../db/schema';
import { desc } from 'drizzle-orm';
import { type Todo } from '../schema';

export const getTodos = async (): Promise<Todo[]> => {
  try {
    const results = await db.select()
      .from(todosTable)
      .orderBy(desc(todosTable.created_at))
      .execute();

    return results.map(todo => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      created_at: todo.created_at
    }));
  } catch (error) {
    console.error('Failed to get todos:', error);
    throw error;
  }
};