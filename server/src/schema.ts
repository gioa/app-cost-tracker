import { z } from 'zod';

// Todo schema
export const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
  created_at: z.coerce.date()
});

export type Todo = z.infer<typeof todoSchema>;

// Input schema for creating todos
export const createTodoInputSchema = z.object({
  title: z.string().min(1, "Title is required")
});

export type CreateTodoInput = z.infer<typeof createTodoInputSchema>;

// Input schema for updating todos
export const updateTodoInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required").optional(),
  completed: z.boolean().optional()
});

export type UpdateTodoInput = z.infer<typeof updateTodoInputSchema>;

// Input schema for toggling todo completion status
export const toggleTodoInputSchema = z.object({
  id: z.number()
});

export type ToggleTodoInput = z.infer<typeof toggleTodoInputSchema>;

// Input schema for deleting todos
export const deleteTodoInputSchema = z.object({
  id: z.number()
});

export type DeleteTodoInput = z.infer<typeof deleteTodoInputSchema>;