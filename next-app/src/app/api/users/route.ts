import { runExec } from '@/db';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { fullName, email, role } = await req.json();
    
    if (!fullName || !email || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = `u_${uuidv4().slice(0, 8)}`;
    runExec(`
      INSERT INTO users (id, full_name, email, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `, [id, fullName, email, role]);
    
    return NextResponse.json({ id, message: "User invited successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to invite user" }, { status: 500 });
  }
}
