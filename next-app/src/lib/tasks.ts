import { runQuery, runSingle, runExec } from '@/db';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  assigned_to: string | null;
  assigned_name: string | null;
  created_by: string;
  status: string;
  workflow_stage: string | null;
  priority: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export function getTasks(projectId: string, status?: string) {
  let sql = `
    SELECT t.*, u.full_name as assigned_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE t.project_id = ?
  `;
  const params: any[] = [projectId];
  if (status) {
    sql += ' AND t.status = ?';
    params.push(status);
  }
  sql += ' ORDER BY (CASE t.priority WHEN \'high\' THEN 1 WHEN \'medium\' THEN 2 WHEN \'low\' THEN 3 ELSE 4 END), t.created_at';
  return runQuery(sql, params) as Task[];
}

export function getTask(taskId: string) {
  return runSingle(`
    SELECT t.*, u.full_name as assigned_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE t.id = ?
  `, [taskId]) as Task | undefined;
}

export function createTask(id: string, title: string, description: string, projectId: string, assignedTo: string | null, createdBy: string): string {
  runExec('INSERT INTO tasks (id, title, description, project_id, assigned_to, created_by, status, workflow_stage, priority, due_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, \'todo\', NULL, \'medium\', NULL, datetime(\'now\'), datetime(\'now\'))', [id, title, description || null, projectId, assignedTo, createdBy]);
  return id;
}

export function updateTask(id: string, title: string, description: string, status: string, assignedTo: string | null, workflowStage: string | null, priority: string, dueDate: string | null): boolean {
  runExec('UPDATE tasks SET title = ?, description = ?, status = ?, assigned_to = ?, workflow_stage = ?, priority = ?, due_date = ?, updated_at = datetime(\'now\') WHERE id = ?', [title, description || null, status, assignedTo, workflowStage, priority, dueDate || null, id]);
  return true;
}

export function deleteTask(id: string): boolean {
  runExec('DELETE FROM tasks WHERE id = ?', [id]);
  return true;
}

export function getTaskComments(taskId: string) {
  return runQuery(`
    SELECT tc.*, u.full_name, u.email
    FROM task_comments tc
    LEFT JOIN users u ON tc.user_id = u.id
    WHERE tc.task_id = ?
    ORDER BY tc.created_at ASC
  `, [taskId]) as any[];
}

export function addTaskComment(id: string, taskId: string, userId: string, content: string, mentionUserIds?: string[]): string {
  runExec('INSERT INTO task_comments (id, task_id, user_id, content, mention_user_ids, created_at) VALUES (?, ?, ?, ?, ?, datetime(\'now\'))', [id, taskId, userId, content, mentionUserIds?.join(',') || null]);
  return id;
}
