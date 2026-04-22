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

export const db = drizzle(sqlite);

export function getDb() {
  return sqlite;
}

export function seedUsersIfEmpty() {
  const count: number = sqlite.prepare('SELECT COUNT(*) as count FROM users').get() as any;
  if (count === 0) {
    sqlite.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, role, created_at, updated_at)
      VALUES (?, 'Admin User', 'admin@pmtool.com', '$2b$10$rK.yZ3qH5L7mN8pQ9wX2YeDfGtBhJkLmNoPqRsTuVwXyZ1aBcDeFg', 'admin', datetime('now'), datetime('now'))
    `).run(
      'u_admin',
    );

    sqlite.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, role, created_at, updated_at)
      VALUES (?, 'Jane Developer', 'jane@pmtool.com', '$2b$10$rK.yZ3qH5L7mN8pQ9wX2YeDfGtBhJkLmNoPqRsTuVwXyZ1aBcDeFg', 'developer', datetime('now'), datetime('now'))
    `).run('u_dev1');

    sqlite.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, role, created_at, updated_at)
      VALUES (?, 'John Client', 'john@clientcorp.com', '$2b$10$rK.yZ3qH5L7mN8pQ9wX2YeDfGtBhJkLmNoPqRsTuVwXyZ1aBcDeFg', 'client', datetime('now'), datetime('now'))
    `).run('u_client1');

    sqlite.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, role, created_at, updated_at)
      VALUES (?, 'Sarah BA', 'sarah@pmtool.com', '$2b$10$rK.yZ3qH5L7mN8pQ9wX2YeDfGtBhJkLmNoPqRsTuVwXyZ1aBcDeFg', 'ba', datetime('now'), datetime('now'))
    `).run('u_ba1');

    sqlite.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, role, created_at, updated_at)
      VALUES (?, 'Mike PM', 'mike@pmtool.com', '$2b$10$rK.yZ3qH5L7mN8pQ9wX2YeDfGtBhJkLmNoPqRsTuVwXyZ1aBcDeFg', 'pm', datetime('now'), datetime('now'))
    `).run('u_pm1');

    sqlite.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, role, created_at, updated_at)
      VALUES (?, 'Lisa Product', 'lisa@pmtool.com', '$2b$10$rK.yZ3qH5L7mN8pQ9wX2YeDfGtBhJkLmNoPqRsTuVwXyZ1aBcDeFg', 'product_manager', datetime('now'), datetime('now'))
    `).run('u_pdm1');

    sqlite.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, role, created_at, updated_at)
      VALUES (?, 'David Head', 'david@pmtool.com', '$2b$10$rK.yZ3qH5L7mN8pQ9wX2YeDfGtBhJkLmNoPqRsTuVwXyZ1aBcDeFg', 'delivery_head', datetime('now'), datetime('now'))
    `).run('u_head1');
  }
}

seedUsersIfEmpty();
