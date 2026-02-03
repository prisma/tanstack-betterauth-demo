'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TodosPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<
    Array<{ id: number; title: string; completed: boolean }>
  >([]);
  const [title, setTitle] = useState('');

  const fetchTodos = async () => {
    const res = await fetch('/api/todos', { credentials: 'include' });
    if (res.status === 401) {
      router.push('/');
      return;
    }
    const data = (await res.json()) as typeof todos;
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const signOut = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'include' });
    router.push('/');
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title: t }),
    });
    setTitle('');
    fetchTodos();
  };

  const toggleTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, { method: 'PATCH', credentials: 'include' });
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchTodos();
  };

  return (
    <div className="min-h-screen p-6 text-white bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Todos</h1>
          <button
            onClick={signOut}
            className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600"
          >
            Sign out
          </button>
        </div>
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a todo..."
            className="flex-1 px-4 py-2 rounded bg-slate-800 border border-slate-700"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500"
          >
            Add
          </button>
        </form>
        <ul className="space-y-2">
          {todos.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between p-3 rounded bg-slate-800 border border-slate-700"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTodo(t.id)}
                />
                <span className={t.completed ? 'line-through opacity-60' : ''}>
                  {t.title}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(t.id)}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </li>
          ))}
          {todos.length === 0 && (
            <li className="opacity-70">No todos yet. Add one above.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
