import { getTask, getTaskComments } from "@/lib/tasks";
import { NextResponse } from "next/server";
import { getProject } from "@/lib/projects";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const task = await getTask(id);
  
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const project = await getProject(task.project_id);
  const comments = await getTaskComments(id);

  return NextResponse.json({
    ...task,
    project,
    comments
  });
}
