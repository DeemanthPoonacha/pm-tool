import { verifyLogin } from "@/lib/permissions";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const result = await verifyLogin(email, password);
  
  if (!result.success) {
    return new Response('Invalid credentials', { status: 401 });
  }

  const sessionId = `s_${crypto.randomUUID()}`;
  
  return new Response(null, {
    status: 302,
    headers: {
      'Set-Cookie': `session_id=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
      'Location': '/dashboard',
    },
  });
}
