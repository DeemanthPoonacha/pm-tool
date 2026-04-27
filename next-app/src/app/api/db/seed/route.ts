import { NextResponse } from 'next/server';
import { createTables, seedDatabase } from '@/lib/db-setup';

export async function POST(request: Request) {
  // Simple protection: Check for a secret key in header or just let it be for now
  // In a real app, you'd want ADMIN_SECRET or similar.
  try {
    await createTables();
    await seedDatabase();
    return NextResponse.json({ message: 'Database initialized and seeded successfully' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
