import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, and } from 'drizzle-orm';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(path.join(dbDir, 'pm-tool.db'));
sqlite.pragma('journal_mode = WAL');

function createTables() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      role TEXT NOT NULL CHECK(role IN ('admin', 'client', 'pm', 'ba', 'developer', 'product_manager', 'delivery_head')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      client_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (client_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS project_workflow_stages (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      stage_name TEXT NOT NULL,
      stage_order INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS project_team (
      project_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      project_role TEXT NOT NULL,
      added_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (project_id, user_id),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS requirements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      project_id TEXT NOT NULL,
      created_by TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft',
      approved_by TEXT,
      approved_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      project_id TEXT NOT NULL,
      assigned_to TEXT,
      created_by TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'todo',
      workflow_stage TEXT,
      priority TEXT NOT NULL DEFAULT 'medium',
      due_date TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_to) REFERENCES users(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS task_comments (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      mention_user_ids TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS change_requests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      project_id TEXT NOT NULL,
      requested_by TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      impact TEXT,
      approved_by TEXT,
      approved_at TEXT,
      rejection_reason TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (requested_by) REFERENCES users(id),
      FOREIGN KEY (approved_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      type TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      link TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS requirement_versions (
      id TEXT PRIMARY KEY,
      requirement_id TEXT NOT NULL,
      project_id TEXT NOT NULL,
      content TEXT,
      version INTEGER NOT NULL,
      created_by TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (requirement_id) REFERENCES requirements(id) ON DELETE CASCADE,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS project_documents (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      title TEXT NOT NULL,
      file_name TEXT,
      file_path TEXT,
      file_type TEXT,
      file_size INTEGER,
      version INTEGER DEFAULT 1,
      uploaded_by TEXT NOT NULL,
      document_type TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (uploaded_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS project_documents_version (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      project_id TEXT NOT NULL,
      file_path TEXT,
      version INTEGER NOT NULL,
      comment TEXT,
      uploaded_by TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (document_id) REFERENCES project_documents(id) ON DELETE CASCADE,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (uploaded_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS change_request_tasks (
      change_request_id TEXT NOT NULL,
      task_id TEXT NOT NULL,
      PRIMARY KEY (change_request_id, task_id),
      FOREIGN KEY (change_request_id) REFERENCES change_requests(id) ON DELETE CASCADE,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    );
  `);
}

createTables();

export const db = drizzle(sqlite);

export function getDb() {
  return sqlite;
}

export function seedDatabase() {
  const userCount: any = sqlite.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    // 1. Seed Users
    const users = [
      ['u_admin', 'Admin User', 'admin@pmtool.com', 'admin'],
      ['u_client1', 'TechCorp CEO', 'ceo@techcorp.com', 'client'],
      ['u_pm1', 'Michael Scott', 'michael@pmtool.com', 'pm'],
      ['u_ba1', 'Sarah Jenkins', 'sarah@pmtool.com', 'ba'],
      ['u_dev1', 'Jane Doe', 'jane@pmtool.com', 'developer'],
      ['u_dev2', 'John Smith', 'john@pmtool.com', 'developer'],
      ['u_pdm1', 'Lisa Ray', 'lisa@pmtool.com', 'product_manager'],
      ['u_head1', 'David Wallace', 'david@pmtool.com', 'delivery_head'],
    ];

    const userStmt = sqlite.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, role, created_at, updated_at)
      VALUES (?, ?, ?, '$2b$10$rK.yZ3qH5L7mN8pQ9wX2YeDfGtBhJkLmNoPqRsTuVwXyZ1aBcDeFg', ?, datetime('now'), datetime('now'))
    `);

    users.forEach(u => userStmt.run(...u));

    // 2. Seed Projects
    const projects = [
      ['p_1', 'Mobile App Redesign', 'Complete overhaul of the customer mobile application for better UX.', 'u_client1', 'active'],
      ['p_2', 'Cloud Migration', 'Migrating legacy on-prem infrastructure to AWS.', 'u_client1', 'active'],
      ['p_3', 'AI Integration', 'Adding predictive analytics to the core dashboard.', 'u_client1', 'active'],
    ];

    const projStmt = sqlite.prepare(`
      INSERT INTO projects (id, name, description, client_id, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    projects.forEach(p => projStmt.run(...p));

    // 3. Seed Workflow Stages
    const stages = ['Requirement', 'Development', 'QA', 'UAT', 'Production'];
    const stageStmt = sqlite.prepare(`
      INSERT INTO project_workflow_stages (id, project_id, stage_name, stage_order, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);

    ['p_1', 'p_2', 'p_3'].forEach(pid => {
      stages.forEach((s, idx) => stageStmt.run(`${pid}_s${idx}`, pid, s, idx));
    });

    // 4. Seed Requirements
    const reqs = [
      ['r_1', 'User Authentication Flow', 'The app must support OAuth2 and MFA.', 'p_1', 'u_ba1', 1, 'approved'],
      ['r_2', 'Push Notifications', 'Real-time alerts for all user actions.', 'p_1', 'u_ba1', 1, 'draft'],
      ['r_3', 'AWS VPC Setup', 'Secure network architecture for the new cloud env.', 'p_2', 'u_ba1', 2, 'approved'],
    ];

    const reqStmt = sqlite.prepare(`
      INSERT INTO requirements (id, title, content, project_id, created_by, version, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    reqs.forEach(r => reqStmt.run(...r));

    // 5. Seed Tasks
    const tasks = [
      ['t_1', 'Implement Login Screen', 'p_1', 'u_dev1', 'u_pm1', 'in-progress', 'Development', 'high'],
      ['t_2', 'Fix Header Alignment', 'p_1', 'u_dev2', 'u_pm1', 'done', 'Development', 'medium'],
      ['t_3', 'Setup S3 Buckets', 'p_2', 'u_dev1', 'u_pm1', 'todo', 'Requirement', 'high'],
      ['t_4', 'Configure Route53', 'p_2', 'u_dev2', 'u_pm1', 'in-progress', 'Development', 'medium'],
    ];

    const taskStmt = sqlite.prepare(`
      INSERT INTO tasks (id, title, project_id, assigned_to, created_by, status, workflow_stage, priority, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    tasks.forEach(t => taskStmt.run(...t));

    // 6. Seed Change Requests
    const crs = [
      ['cr_1', 'Add Dark Mode Support', 'Client requested dark mode for the mobile app.', 'p_1', 'u_client1', 'pending', 'Medium'],
      ['cr_2', 'Multi-region deployment', 'Expand cloud migration to include EU-Central-1.', 'p_2', 'u_client1', 'approved', 'High'],
    ];

    const crStmt = sqlite.prepare(`
      INSERT INTO change_requests (id, title, description, project_id, requested_by, status, impact, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    crs.forEach(c => crStmt.run(...c));

    // 7. Seed Audit Logs
    const audits = [
      ['a_1', 'u_pm1', 'CREATE', 'project', 'p_1', 'Created Mobile App Redesign'],
      ['a_2', 'u_ba1', 'APPROVE', 'requirement', 'r_1', 'Approved Authentication Flow'],
      ['a_3', 'u_client1', 'CREATE', 'change_request', 'cr_1', 'Requested Dark Mode'],
    ];

    const auditStmt = sqlite.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    audits.forEach(a => auditStmt.run(...a));

    // 8. Seed Notifications
    const notifs = [
      ['n_1', 'u_dev1', 'New Task Assigned', 'You have been assigned to Implement Login Screen', 'task', 0],
      ['n_2', 'u_pm1', 'CR Pending Review', 'New Change Request: Add Dark Mode Support', 'cr', 0],
    ];

    const notifStmt = sqlite.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    notifs.forEach(n => notifStmt.run(...n));
    // 9. Seed Project Documents
    const docs = [
      ['d_1', 'p_1', 'UI Style Guide', 'style_guide.pdf', '/docs/style_guide.pdf', 'pdf', 1024 * 1024, 'u_ba1', 'design'],
      ['d_2', 'p_2', 'VPC Architecture', 'vpc_v1.png', '/docs/vpc_v1.png', 'image', 500 * 1024, 'u_dev1', 'infrastructure'],
    ];

    const docStmt = sqlite.prepare(`
      INSERT INTO project_documents (id, project_id, title, file_name, file_path, file_type, file_size, uploaded_by, document_type, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    docs.forEach(d => docStmt.run(...d));

    // 10. Seed Change Request Tasks links
    const crTasks = [
      ['cr_2', 't_3'],
      ['cr_2', 't_4'],
    ];

    const crtStmt = sqlite.prepare(`
      INSERT INTO change_request_tasks (change_request_id, task_id)
      VALUES (?, ?)
    `);

    crTasks.forEach(crt => crtStmt.run(...crt));
  }
}

seedDatabase();
