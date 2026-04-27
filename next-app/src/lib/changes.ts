import { runQuery, runSingle, runExec } from '@/db';

export interface ChangeRequest {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  requested_by: string;
  requested_by_name: string | null;
  status: string;
  impact: string | null;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export async function getChangeRequests(projectId: string): Promise<ChangeRequest[]> {
  return (await runQuery(`
    SELECT cr.*, u.full_name as requested_by_name
    FROM change_requests cr
    LEFT JOIN users u ON cr.requested_by = u.id
    WHERE cr.project_id = ?
    ORDER BY cr.created_at DESC
  `, [projectId])) as ChangeRequest[];
}

export async function getChangeRequest(id: string): Promise<ChangeRequest | undefined> {
  return (await runSingle(`
    SELECT cr.*, u.full_name as requested_by_name
    FROM change_requests cr
    LEFT JOIN users u ON cr.requested_by = u.id
    WHERE cr.id = ?
  `, [id])) as ChangeRequest | undefined;
}

export async function createChangeRequest(id: string, title: string, description: string, projectId: string, requestedBy: string): Promise<string> {
  await runExec('INSERT INTO change_requests (id, title, description, project_id, requested_by, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, \'pending\', datetime(\'now\'), datetime(\'now\'))', [id, title, description || null, projectId, requestedBy]);
  return id;
}

export async function approveChangeRequest(id: string, approvedBy: string, impact: string | null): Promise<boolean> {
  await runExec("UPDATE change_requests SET status = 'approved', approved_by = ?, approved_at = datetime('now'), impact = ? WHERE id = ?", [approvedBy, impact || null, id]);
  return true;
}

export async function rejectChangeRequest(id: string, rejectionReason: string): Promise<boolean> {
  await runExec("UPDATE change_requests SET status = 'rejected', rejection_reason = ? WHERE id = ?", [rejectionReason, id]);
  return true;
}

export async function addChangeRequestTasks(changeRequestId: string, taskIds: string[]): Promise<boolean> {
  await Promise.all(taskIds.map(taskId => 
    runExec('INSERT OR IGNORE INTO change_request_tasks (change_request_id, task_id) VALUES (?, ?)', [changeRequestId, taskId])
  ));
  return true;
}

export async function getChangeRequestTasks(changeRequestId: string): Promise<any[]> {
  return (await runQuery(`
    SELECT t.*, crt.change_request_id
    FROM change_request_tasks crt
    JOIN tasks t ON crt.task_id = t.id
    WHERE crt.change_request_id = ?
  `, [changeRequestId])) as any[];
}

export async function getAuditLogs(entityType?: string, limit = 100) {
  let sql = 'SELECT * FROM audit_logs';
  const params: any[] = [];
  if (entityType) {
    sql += ' WHERE entity_type = ?';
    params.push(entityType);
  }
  sql += ` ORDER BY created_at DESC LIMIT ${limit}`;
  return await runQuery(sql, params);
}

export async function addAuditLog(userId: string, action: string, entityType: string, entityId: string, details: string): Promise<string> {
  const id = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await runExec('INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime(\'now\'))', [id, userId, action, entityType, entityId, details]);
  return id;
}

export async function getNotifications(userId: string, isRead?: boolean) {
  let sql = 'SELECT * FROM notifications WHERE user_id = ?';
  const params: any[] = [userId];
  if (isRead !== undefined) {
    sql += ' AND is_read = ?';
    params.push(isRead ? 1 : 0);
  }
  sql += ' ORDER BY created_at DESC';
  return await runQuery(sql, params);
}

export async function markNotificationRead(notificationId: string): Promise<boolean> {
  await runExec('UPDATE notifications SET is_read = 1 WHERE id = ?', [notificationId]);
  return true;
}

export async function createNotification(userId: string, title: string, message: string, type: string, link: string): Promise<string> {
  const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await runExec('INSERT INTO notifications (id, user_id, title, message, type, is_read, link, created_at) VALUES (?, ?, ?, ?, ?, 0, ?, datetime(\'now\'))', [id, userId, title, message, type, link]);
  return id;
}
