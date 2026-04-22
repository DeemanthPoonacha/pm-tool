import { runQuery, runSingle, runExec } from '@/db';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  client_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  client_name?: string;
  team_count?: number;
}

export function getProjects(clientId?: string): Project[] {
  if (clientId) {
    return runQuery(`
      SELECT p.*, u.full_name as client_name
      FROM projects p
      LEFT JOIN users u ON p.client_id = u.id
      WHERE p.client_id = ?
      ORDER BY p.created_at DESC
    `, [clientId]) as Project[];
  }
  return runQuery(`
    SELECT p.*, u.full_name as client_name,
    (SELECT COUNT(*) FROM project_team pt WHERE pt.project_id = p.id) as team_count
    FROM projects p
    LEFT JOIN users u ON p.client_id = u.id
    ORDER BY p.created_at DESC
  `) as Project[];
}

export function getProject(projectId: string) {
  return runSingle(`
    SELECT p.*, u.full_name as client_name
    FROM projects p
    LEFT JOIN users u ON p.client_id = u.id
    WHERE p.id = ?
  `, [projectId]);
}

export function getProjectTeam(projectId: string) {
  return runQuery(`
    SELECT pt.user_id, pt.project_role, u.full_name
    FROM project_team pt
    LEFT JOIN users u ON pt.user_id = u.id
    WHERE pt.project_id = ?
  `, [projectId]) as { user_id: string; project_role: string; full_name: string }[];
}

export function getProjectWorkflowStages(projectId: string) {
  return runQuery(`
    SELECT id, stage_name, stage_order
    FROM project_workflow_stages
    WHERE project_id = ?
    ORDER BY stage_order
  `, [projectId]);
}

export function createProject(id: string, name: string, description: string, clientId: string, team: string[]): string {
  runExec('INSERT INTO projects (id, name, description, client_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, \'active\', datetime(\'now\'), datetime(\'now\'))', [id, name, description, clientId]);
  team.forEach(userId => {
    runExec('INSERT INTO project_team (project_id, user_id, project_role, added_at) VALUES (?, ?, \'member\', datetime(\'now\'))', [id, userId]);
  });
  const defaultStages = ['Requirement', 'Development', 'QA', 'UAT', 'Production'];
  defaultStages.forEach((stage, idx) => {
    runExec('INSERT INTO project_workflow_stages (id, project_id, stage_name, stage_order, created_at) VALUES (?, ?, ?, ?, datetime(\'now\'))', [`${id}_stage_${idx}`, id, stage, idx]);
  });
  return id;
}

export function updateProject(id: string, name: string, description: string): boolean {
  runExec('UPDATE projects SET name = ?, description = ?, updated_at = datetime(\'now\') WHERE id = ?', [name, description, id]);
  return true;
}

export function deleteProject(id: string): boolean {
  runExec('DELETE FROM projects WHERE id = ?', [id]);
  return true;
}

export function addTeamMember(projectId: string, userId: string, projectRole: string): boolean {
  runExec('INSERT OR IGNORE INTO project_team (project_id, user_id, project_role, added_at) VALUES (?, ?, ?, datetime(\'now\'))', [projectId, userId, projectRole]);
  return true;
}

export function removeTeamMember(projectId: string, userId: string): boolean {
  runExec('DELETE FROM project_team WHERE project_id = ? AND user_id = ?', [projectId, userId]);
  return true;
}

export function addWorkflowStage(projectId: string, stageName: string): string {
  const id = `stage_${projectId}_${Date.now()}`;
  const maxOrder = runSingle(`SELECT MAX(stage_order) as max FROM project_workflow_stages WHERE project_id = ?`, [projectId]) as any;
  runExec('INSERT INTO project_workflow_stages (id, project_id, stage_name, stage_order, created_at) VALUES (?, ?, ?, ?, datetime(\'now\'))', [id, projectId, stageName, (maxOrder?.max || 0) + 1]);
  return id;
}

export function reorderWorkflowStages(projectId: string, stageOrder: string[]): string[] {
  stageOrder.forEach((stageId, idx) => {
    runExec('UPDATE project_workflow_stages SET stage_order = ? WHERE id = ?', [idx, stageId]);
  });
  return stageOrder;
}

export function removeWorkflowStage(projectId: string, stageId: string): boolean {
  runExec('DELETE FROM project_workflow_stages WHERE id = ?', [stageId]);
  return true;
}
