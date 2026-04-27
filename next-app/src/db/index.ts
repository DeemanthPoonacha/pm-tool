import { getDb } from '@/lib/db-setup';

export type User = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at?: string;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  client_id: string;
  status: string;
  client_name?: string;
  created_at: string;
  updated_at: string;
};

export type ProjectWithTeam = Project & {
  team: { user_id: string; full_name: string; role: string }[];
  workflow_stages: { id: string; stage_name: string; stage_order: number }[];
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  assigned_to: string | null;
  assigned_name?: string;
  status: string;
  workflow_stage: string | null;
  priority: string;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Requirement = {
  id: string;
  title: string;
  content: string | null;
  project_id: string;
  created_by: string;
  created_by_name?: string;
  version: number;
  status: string;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ChangeRequest = {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  requested_by: string;
  requested_by_name?: string;
  status: string;
  impact: string | null;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
};

export interface DbRow {
  [key: string]: any;
}

export async function runQuery(sql: string, params: any[] = []) {
  const client = getDb();
  const res = await client.execute({ sql, args: params });
  return res.rows as unknown as DbRow[];
}

export async function runSingle(sql: string, params: any[] = []) {
  const client = getDb();
  const res = await client.execute({ sql, args: params });
  return (res.rows[0] as unknown as DbRow) || undefined;
}

export async function runExec(sql: string, params: any[] = []) {
  const client = getDb();
  return await client.execute({ sql, args: params });
}
