import { cookies } from "next/headers";
import { v4 as uuidv4 } from 'uuid';
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const { verifyLogin } = await import('@/lib/permissions');
  const result = verifyLogin(email, password);
  
  if (!result.success) {
    return Response.redirect(new URL('/login?error=invalid', req.url));
  }

  const sessionId = `s_${uuidv4()}`;
  
  return Response.redirect(new URL('/dashboard', req.url), {
    headers: {
      'Set-Cookie': `session_id=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
    },
  });
}

export async function POST$Register(req: Request) {
  const formData = await req.formData();
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const { createUser } = await import('@/lib/permissions');
  const { hashPassword } = await import('@/lib/auth-utils');
  const id = `u_${crypto.randomUUID().slice(0, 12)}`;
  
  createUser(id, fullName, email, hashPassword(password), 'developer');
  
  return Response.redirect(new URL('/login', req.url));
}
