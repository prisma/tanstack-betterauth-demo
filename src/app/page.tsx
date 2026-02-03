'use client';

import { useState } from 'react';

export default function AuthPage() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-md mx-auto pt-14 p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome</h1>
        <div className="flex items-center mb-4 rounded bg-slate-800 border border-slate-700 p-1">
          <button
            onClick={() => setMode('sign-in')}
            className={`flex-1 px-3 py-2 rounded ${mode === 'sign-in' ? 'bg-slate-700' : 'hover:bg-slate-700/60'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('sign-up')}
            className={`flex-1 px-3 py-2 rounded ${mode === 'sign-up' ? 'bg-slate-700' : 'hover:bg-slate-700/60'}`}
          >
            Sign Up
          </button>
        </div>
        <div className="mt-4">
          <AuthForm mode={mode} />
        </div>
      </div>
    </div>
  );
}

function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const action =
    mode === 'sign-in' ? '/api/auth/sign-in/email' : '/api/auth/sign-up/email';
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const email = String(formData.get('email') || '');
        const password = String(formData.get('password') || '');
        const name =
          mode === 'sign-up'
            ? String(formData.get('name') || email.split('@')[0] || 'User')
            : undefined;
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(
            mode === 'sign-in'
              ? { email, password }
              : { name, email, password },
          ),
        });
        if (!res.ok) {
          alert(`${mode} failed`);
          return;
        }
        window.location.href = '/todos';
      }}
      className="space-y-3"
    >
      <h3 className="text-lg font-semibold text-white capitalize">{mode}</h3>
      <input
        style={{ display: mode === 'sign-up' ? 'block' : 'none' }}
        name="name"
        type="text"
        placeholder="name"
        className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white"
      />
      <input
        name="email"
        type="email"
        placeholder="email"
        className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white"
      />
      <input
        name="password"
        type="password"
        placeholder="password"
        className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-white w-full"
      >
        {mode === 'sign-in' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
}
