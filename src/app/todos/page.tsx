'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Todo = { id: number; title: string; completed: boolean };

/** Temporary id for optimistic adds (negative = not yet saved) */
function tempId(): number {
  return -Date.now();
}

export default function TodosPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [warning, setWarning] = useState<string | null>(null);

  const fetchTodos = async () => {
    const res = await fetch('/api/todos', { credentials: 'include' });
    if (res.status === 401) {
      router.push('/');
      return;
    }
    const data = (await res.json()) as Todo[];
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
    setWarning(null);
    const optimistic: Todo = { id: tempId(), title: t, completed: false };
    setTodos((prev) => [optimistic, ...prev]);
    setTitle('');

    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title: t }),
    });

    if (res.status === 401) {
      router.push('/');
      return;
    }
    if (!res.ok) {
      setTodos((prev) => prev.filter((item) => item.id !== optimistic.id));
      setWarning('Could not save the new todo. Please try again.');
      return;
    }
    const saved = (await res.json()) as Todo;
    setTodos((prev) =>
      prev.map((item) => (item.id === optimistic.id ? saved : item)),
    );
  };

  const toggleTodo = async (id: number) => {
    if (id < 0) return; // optimistic add not yet saved
    setWarning(null);
    const previous = todos.find((t) => t.id === id);
    if (!previous) return;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (res.status === 401) {
      router.push('/');
      return;
    }
    if (!res.ok) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? previous : t)),
      );
      setWarning('Could not update the todo. Please try again.');
    }
  };

  const deleteTodo = async (id: number) => {
    if (id < 0) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    setWarning(null);
    const previous = todos.find((t) => t.id === id);
    if (!previous) return;
    setTodos((prev) => prev.filter((t) => t.id !== id));

    const res = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.status === 401) {
      router.push('/');
      return;
    }
    if (!res.ok) {
      setTodos((prev) => [...prev, previous]);
      setWarning('Could not delete the todo. Please try again.');
    }
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

        {warning && (
          <div
            role="alert"
            className="mb-4 flex items-center justify-between gap-4 rounded bg-amber-900/80 border border-amber-600 px-4 py-3 text-amber-100"
          >
            <span>{warning}</span>
            <button
              type="button"
              onClick={() => setWarning(null)}
              className="shrink-0 rounded p-1 hover:bg-amber-800/80 transition-colors"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

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
                  disabled={t.id < 0}
                />
                <span className={t.completed ? 'line-through opacity-60' : ''}>
                  {t.title}
                </span>
                {t.id < 0 && (
                  <span className="text-xs text-slate-400">Saving…</span>
                )}
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
