import { type Todo } from '../schema';

export async function getTodos(): Promise<Todo[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all todo items from the database.
    // For now, returning mock data to demonstrate frontend rendering
    return Promise.resolve([
        {
            id: 1,
            title: "Learn TypeScript",
            completed: true,
            created_at: new Date('2024-01-01')
        },
        {
            id: 2,
            title: "Build Todo App",
            completed: false,
            created_at: new Date('2024-01-02')
        },
        {
            id: 3,
            title: "Deploy to Production",
            completed: false,
            created_at: new Date('2024-01-03')
        }
    ] as Todo[]);
}