import { getChangeRequest, getChangeRequestTasks } from "@/lib/changes";
import { NextResponse } from "next/server";
import { getProject } from "@/lib/projects";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cr = await getChangeRequest(id);
  
  if (!cr) {
    return NextResponse.json({ error: "Change request not found" }, { status: 404 });
  }

  const project = await getProject(cr.project_id);
  const tasks = await getChangeRequestTasks(id);

  return NextResponse.json({
    ...cr,
    project,
    tasks
  });
}
