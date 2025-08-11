import { db } from '../db';
import { todosTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type DeleteTodoInput } from '../schema';

export const deleteTodo = async (input: DeleteTodoInput): Promise<{ success: boolean; id?: number }> => {
  try {
    const result = await db.delete(todosTable)
      .where(eq(todosTable.id, input.id))
      .returning({ id: todosTable.id })
      .execute();

    if (result.length === 0) {
      return {
        success: false
      };
    }

    return {
      success: true,
      id: result[0].id
    };
  } catch (error) {
    console.error('Todo deletion failed:', error);
    return {
      success: false
    };
  }
};