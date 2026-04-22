import { createUser } from "@/lib/permissions";
import { hashPassword } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  const formData = await req.formData();
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const id = `u_${crypto.randomUUID().slice(0, 12)}`;
  createUser(id, fullName, email, hashPassword(password), 'developer');
  
  return redirect('/login');
}
