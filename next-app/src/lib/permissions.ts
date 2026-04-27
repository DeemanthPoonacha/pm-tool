import { runQuery, runSingle, runExec, User, DbRow } from '@/db';

const ROLES = ['admin', 'client', 'pm', 'ba', 'developer', 'product_manager', 'delivery_head'] as const;

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  client: 'Client',
  pm: 'Project Manager',
  ba: 'Business Analyst',
  developer: 'Developer',
  product_manager: 'Product Manager',
  delivery_head: 'Delivery Head',
};

export { ROLES, roleLabels };

export const PERMISSIONS: Record<string, string[]> = {
  admin: ['user:read', 'user:write', 'user:delete', 'project:read', 'project:write', 'project:delete', 'task:read', 'task:write', 'requirement:read', 'requirement:write', 'requirement:approve', 'change_request:read', 'change_request:write', 'document:read', 'document:write', 'report:read', 'team:read', 'team:write'],
  client: ['project:read', 'task:read', 'requirement:read', 'requirement:review', 'change_request:write', 'change_request:read', 'document:read', 'team:read'],
  pm: ['project:read', 'project:write', 'project:delete', 'task:read', 'task:write', 'task:delete', 'requirement:read', 'requirement:approve', 'change_request:read', 'change_request:write', 'change_request:approve', 'document:read', 'document:write', 'report:read', 'report:delete', 'team:read', 'team:write'],
  ba: ['project:read', 'task:read', 'requirement:read', 'requirement:write', 'requirement:delete', 'requirement:approve', 'document:read', 'document:write', 'team:read'],
  developer: ['project:read', 'task:read', 'task:write', 'requirement:read', 'change_request:read', 'document:read', 'team:read', 'report:read'],
  product_manager: ['project:read', 'task:read', 'requirement:read', 'requirement:write', 'requirement:approve', 'change_request:read', 'change_request:write', 'document:read', 'document:write', 'report:read', 'report:delete', 'team:read'],
  delivery_head: ['project:read', 'task:read', 'requirement:read', 'requirement:approve', 'change_request:read', 'change_request:approve', 'document:read', 'team:read', 'report:read', 'report:delete'],
};

export function can(userRole: string, permission: string): boolean {
  const perms = PERMISSIONS[userRole];
  return perms ? perms.includes(permission) : false;
}

export async function getUser(userId: string): Promise<User | undefined> {
  const row = await runSingle('SELECT id, full_name, email, role, created_at FROM users WHERE id = ?', [userId]);
  if (!row) return undefined;
  return { id: row.id, full_name: row.full_name, email: row.email, role: row.role, created_at: row.created_at };
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const row = await runSingle('SELECT id, full_name, email, password_hash, role, created_at FROM users WHERE email = ?', [email]);
  if (!row) return undefined;
  return { id: row.id, full_name: row.full_name, email: row.email, role: row.role, created_at: row.created_at };
}

export async function verifyLogin(email: string, password: string): Promise<{ success: boolean; user: User | null; error?: string }> {
  const row = await runSingle('SELECT id, full_name, email, password_hash, role FROM users WHERE email = ?', [email]);
  if (!row) return { success: false, user: null, error: 'Invalid email or password' };

  const result = require('crypto').scryptSync(password, row.password_hash.split(':')[1], 64).toString('hex');
  const storedHash = row.password_hash.split(':')[2];
  const valid = result === storedHash;

  if (!valid) return { success: false, user: null, error: 'Invalid email or password' };

  return { success: true, user: { id: row.id, full_name: row.full_name, email: row.email, role: row.role } };
}

export async function getAllUsers(): Promise<User[]> {
  return (await runQuery('SELECT id, full_name, email, role, created_at FROM users ORDER BY full_name')) as User[];
}

export async function createUser(id: string, full_name: string, email: string, passwordHash: string, role: string): Promise<boolean> {
  try {
    await runExec('INSERT INTO users (id, full_name, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime(\'now\'), datetime(\'now\'))', [id, full_name, email, passwordHash, role]);
    return true;
  } catch {
    return false;
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  await runExec('DELETE FROM users WHERE id = ?', [userId]);
  return true;
}

export async function updateUserRole(userId: string, role: string): Promise<boolean> {
  await runExec('UPDATE users SET role = ?, updated_at = datetime(\'now\') WHERE id = ?', [role, userId]);
  return true;
}
