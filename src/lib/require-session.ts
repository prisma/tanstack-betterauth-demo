import { auth } from '@/auth';
import { headers } from 'next/headers';

export async function requireSession(): Promise<{ user: { id: string } } | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) return null;
  return { user: { id: session.user.id } };
}
