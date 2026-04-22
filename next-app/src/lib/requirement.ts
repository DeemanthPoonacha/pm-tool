import { runQuery, runSingle, runExec } from '@/db';

export interface Requirement {
  id: string;
  title: string;
  content: string | null;
  project_id: string;
  created_by: string;
  created_by_name: string | null;
  version: number;
  status: string;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export function getRequirements(projectId: string) {
  return runQuery(`
    SELECT r.*, u.full_name as created_by_name
    FROM requirements r
    LEFT JOIN users u ON r.created_by = u.id
    WHERE r.project_id = ?
    ORDER BY r.created_at DESC
  `, [projectId]) as Requirement[];
}

export function getRequirement(requirementId: string) {
  return runSingle(`
    SELECT r.*, u.full_name as created_by_name
    FROM requirements r
    LEFT JOIN users u ON r.created_by = u.id
    WHERE r.id = ?
  `, [requirementId]);
}

export function getRequirementVersions(requirementId: string) {
  return runQuery('SELECT * FROM requirement_versions WHERE requirement_id = ? ORDER BY version DESC', [requirementId]);
}

export function createRequirement(id: string, title: string, content: string, projectId: string, createdBy: string, documentType?: string): string {
  runExec('INSERT INTO requirements (id, title, content, project_id, created_by, version, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 1, \'draft\', datetime(\'now\'), datetime(\'now\'))', [id, title, content, projectId, createdBy]);
  runExec('INSERT INTO requirement_versions (id, requirement_id, project_id, content, version, created_by, created_at) VALUES (?, ?, ?, ?, 1, ?, datetime(\'now\'))', [`${id}_v1`, id, projectId, content, createdBy]);
  return id;
}

export function updateRequirementContent(requirementId: string, content: string, updatedBy: string, projectId: string): string {
  const req = runSingle('SELECT version FROM requirements WHERE id = ?', [requirementId]) as any;
  const newVersion = (req?.version || 0) + 1;
  runExec('INSERT INTO requirement_versions (id, requirement_id, project_id, content, version, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime(\'now\'))', [`${requirementId}_v${newVersion}`, requirementId, projectId, content, newVersion, updatedBy]);
  runExec('UPDATE requirements SET version = ?, updated_at = datetime(\'now\') WHERE id = ?', [newVersion, requirementId]);
  return `${requirementId}_v${newVersion}`;
}

export function approveRequirement(requirementId: string, approvedBy: string): boolean {
  runExec("UPDATE requirements SET status = 'approved', approved_by = ?, approved_at = datetime('now') WHERE id = ?", [approvedBy, requirementId]);
  return true;
}

export function rejectRequirement(requirementId: string): boolean {
  runExec("UPDATE requirements SET status = 'rejected' WHERE id = ?", [requirementId]);
  return true;
}

export function deleteRequirement(requirementId: string): boolean {
  runExec('DELETE FROM requirements WHERE id = ?', [requirementId]);
  return true;
}

export function uploadDocument(id: string, projectId: string, title: string, fileName: string, filePath: string, fileType: string, fileSize: number, uploadedBy: string, documentType: string): string {
  runExec('INSERT INTO project_documents (id, project_id, title, file_name, file_path, file_type, file_size, version, uploaded_by, document_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, datetime(\'now\'), datetime(\'now\'))', [id, projectId, title, fileName, filePath, fileType, fileSize, uploadedBy, documentType]);
  return id;
}

export function getProjectDocuments(projectId: string, documentType?: string) {
  let sql = 'SELECT pd.*, u.full_name as uploaded_by_name FROM project_documents pd LEFT JOIN users u ON pd.uploaded_by = u.id WHERE pd.project_id = ?';
  const params: any[] = [projectId];
  if (documentType) {
    sql += ' AND pd.document_type = ?';
    params.push(documentType);
  }
  sql += ' ORDER BY pd.updated_at DESC';
  return runQuery(sql, params);
}

export function addDocumentVersion(documentId: string, projectId: string, filePath: string, version: number, comment: string, uploadedBy: string): string {
  runExec('INSERT INTO project_documents_version (id, document_id, project_id, file_path, version, comment, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime(\'now\'))', [`${documentId}_v${version}`, documentId, projectId, filePath, version, comment || null, uploadedBy]);
  runExec('UPDATE project_documents SET version = ?, updated_at = datetime(\'now\') WHERE id = ?', [version, documentId]);
  return `${documentId}_v${version}`;
}
