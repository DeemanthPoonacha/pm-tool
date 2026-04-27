import { runQuery } from '@/db';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export async function getUsers(role?: string): Promise<User[]> {
  if (role) {
    return (await runQuery('SELECT id, full_name, email, role FROM users WHERE role = ?', [role])) as User[];
  }
  return (await runQuery('SELECT id, full_name, email, role FROM users')) as User[];
}
