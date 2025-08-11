import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Mock data for todo items
const mockTodos = [
  {
    id: 1,
    title: 'Learn React',
    completed: true,
    created_at: new Date('2024-01-15')
  },
  {
    id: 2,
    title: 'Build a todo app',
    completed: false,
    created_at: new Date('2024-01-16')
  },
  {
    id: 3,
    title: 'Master TypeScript',
    completed: false,
    created_at: new Date('2024-01-17')
  },
  {
    id: 4,
    title: 'Deploy to production',
    completed: false,
    created_at: new Date('2024-01-18')
  }
];

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: Date;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: Math.max(...todos.map(t => t.id), 0) + 1,
      title: newTodoTitle.trim(),
      completed: false,
      created_at: new Date()
    };

    setTodos((prev: Todo[]) => [...prev, newTodo]);
    setNewTodoTitle('');
  };

  const handleToggleTodo = (id: number) => {
    setTodos((prev: Todo[]) =>
      prev.map((todo: Todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((prev: Todo[]) => prev.filter((todo: Todo) => todo.id !== id));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📝 Todo List</h1>
          <p className="text-gray-600">Stay organized and get things done!</p>
        </div>

        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Add New Todo</span>
              <Badge variant="outline" className="text-sm">
                {completedCount}/{totalCount} completed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTodo} className="flex gap-2">
              <Input
                value={newTodoTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewTodoTitle(e.target.value)
                }
                placeholder="What needs to be done?"
                className="flex-1"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                ✨ Add Todo
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Todos</CardTitle>
          </CardHeader>
          <CardContent>
            {todos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg mb-2">🎉 No todos yet!</p>
                <p>Add your first todo above to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo: Todo, index: number) => (
                  <div key={todo.id}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox
                        id={`todo-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={() => handleToggleTodo(todo.id)}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={`todo-${todo.id}`}
                          className={`block text-sm font-medium cursor-pointer ${
                            todo.completed
                              ? 'line-through text-gray-500'
                              : 'text-gray-900'
                          }`}
                        >
                          {todo.title}
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                          Created: {todo.created_at.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {todo.completed && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            ✓ Done
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                    {index < todos.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {todos.length > 0 && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-4 bg-white rounded-lg px-6 py-3 shadow-md">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-green-600">{completedCount}</span> completed
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">{totalCount - completedCount}</span> remaining
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;