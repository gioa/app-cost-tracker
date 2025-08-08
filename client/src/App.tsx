import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import './App.css';

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

// Mock data for demonstration
const mockTodos: TodoItem[] = [
  { id: 1, title: 'Complete project documentation', completed: false },
  { id: 2, title: 'Review code changes', completed: true },
  { id: 3, title: 'Schedule team meeting', completed: false },
  { id: 4, title: 'Update dependencies', completed: true },
  { id: 5, title: 'Write unit tests', completed: false },
  { id: 6, title: 'Deploy to staging', completed: false },
];

function App() {
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const toggleTodo = (id: number) => {
    setTodos((prevTodos: TodoItem[]) =>
      prevTodos.map((todo: TodoItem) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const addTodo = () => {
    if (newTodoTitle.trim() === '') return;
    
    const newTodo: TodoItem = {
      id: Math.max(...todos.map(t => t.id), 0) + 1,
      title: newTodoTitle.trim(),
      completed: false,
    };
    
    setTodos((prevTodos: TodoItem[]) => [...prevTodos, newTodo]);
    setNewTodoTitle('');
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos: TodoItem[]) => prevTodos.filter((todo: TodoItem) => todo.id !== id));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="todo-app">
      <div className="container mx-auto max-w-2xl p-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📝 Todo List</h1>
          <p className="text-gray-600">
            {completedCount} of {totalCount} tasks completed
          </p>
        </header>

        <div className="add-todo-section mb-6">
          <Card className="p-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a new todo..."
                value={newTodoTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodoTitle(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    addTodo();
                  }
                }}
                className="flex-1"
              />
              <Button onClick={addTodo} disabled={newTodoTitle.trim() === ''}>
                Add Todo
              </Button>
            </div>
          </Card>
        </div>

        <div className="todos-list">
          {todos.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 text-lg">🎉 No todos yet! Add one above to get started.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {todos.map((todo: TodoItem) => (
                <Card key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="flex items-center gap-3 p-4">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                    />
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? 'text-gray-500 line-through'
                          : 'text-gray-800'
                      }`}
                    >
                      {todo.title}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Click the checkbox to mark todos as complete
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;