import { v4 as uuidv4 } from 'uuid';
import { createProject } from '@/lib/projects';

export async function POST(req: Request) {
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const clientId = formData.get('clientId') as string;
  const description = formData.get('description') as string;
  const team = formData.getAll('team') as string[];
  
  const id = `p_${uuidv4().slice(0, 12)}`;
  createProject(id, name, description, clientId, team);
  
  return Response.redirect(new URL('/dashboard', req.url));
}
