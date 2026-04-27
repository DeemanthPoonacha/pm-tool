import { createTask, getTasks, updateTask } from "@/lib/tasks";
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from "next/server";
import { getProjects } from "@/lib/projects";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  
  if (projectId) {
    const tasks = getTasks(projectId);
    return NextResponse.json(tasks);
  }

  // If no project ID, maybe return all tasks for all projects
  const projects = getProjects();
  const allTasks = projects.flatMap(p => getTasks(p.id));
  return NextResponse.json(allTasks);
}

export async function POST(req: Request) {
  try {
    const { title, description, projectId, assignedTo, createdBy } = await req.json();
    
    if (!title || !projectId || !createdBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = `t_${uuidv4().slice(0, 12)}`;
    createTask(id, title, description, projectId, assignedTo, createdBy);
    
    return NextResponse.json({ id, message: "Task created successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    // Simplified update for status
    const task = (await import('@/lib/tasks')).getTask(id);
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    
    updateTask(id, task.title, task.description || '', status, task.assigned_to, task.workflow_stage, task.priority, task.due_date);
    return NextResponse.json({ message: "Task updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
