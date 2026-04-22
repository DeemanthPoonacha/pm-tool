import { cookies } from "next/headers";
import { v4 as uuidv4 } from 'uuid';
import { redirect } from "next/navigation";
import { createUser } from "@/lib/permissions";
import { hashPassword } from "@/lib/auth-utils";

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

export async function GET(req: Request) {
  return Response.redirect(new URL('/', { req.url }));
}
