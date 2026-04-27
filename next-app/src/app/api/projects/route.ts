import { createProject, getProjects } from "@/lib/projects";
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from "next/server";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, clientId, description, team } = body;
    
    if (!name || !clientId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = `p_${uuidv4().slice(0, 12)}`;
    await createProject(id, name, description, clientId, team || []);
    
    return NextResponse.json({ id, message: "Project created successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
