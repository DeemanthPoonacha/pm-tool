import { runQuery } from '@/db';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export function getUsers(role?: string) {
  if (role) {
    return runQuery('SELECT id, full_name, email, role FROM users WHERE role = ?', [role]) as User[];
  }
  return runQuery('SELECT id, full_name, email, role FROM users') as User[];
}
