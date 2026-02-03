'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const linkBase = 'px-3 py-1 rounded hover:bg-gray-700 transition-colors';
  const isActive = (to: string) => pathname === to;

  return (
    <header className="p-4 flex items-center justify-between bg-gray-800 text-white shadow">
      <Link href="/" className="text-lg font-semibold">
        Todo App
      </Link>
      <nav className="flex items-center gap-4">
        <Link
          href="/"
          className={`${linkBase} ${isActive('/') ? 'bg-gray-700' : ''}`}
        >
          Login
        </Link>
        <Link
          href="/todos"
          className={`${linkBase} ${isActive('/todos') ? 'bg-gray-700' : ''}`}
        >
          Todos
        </Link>
      </nav>
    </header>
  );
}
