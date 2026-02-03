import { NextResponse } from 'next/server';
import { prisma } from '@/db';
import { requireSession } from '@/lib/require-session';

export async function GET() {
  const authData = await requireSession();
  if (!authData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const todos = await prisma.todo.findMany({
    where: { userId: authData.user.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const authData = await requireSession();
  if (!authData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as { title?: unknown };
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) {
    return NextResponse.json({ error: 'Title required' }, { status: 400 });
  }
  const todo = await prisma.todo.create({
    data: { title, userId: authData.user.id },
  });
  return NextResponse.json(todo, { status: 201 });
}
