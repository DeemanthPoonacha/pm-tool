import { getProject, getProjectTeam, getProjectWorkflowStages } from "@/lib/projects";
import { getTasks } from "@/lib/tasks";
import { getRequirements, getProjectDocuments } from "@/lib/requirement";
import { getChangeRequests } from "@/lib/changes";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await getProject(id);
  
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const team = await getProjectTeam(id);
  const stages = await getProjectWorkflowStages(id);
  const tasks = await getTasks(id);
  const requirements = await getRequirements(id);
  const documents = await getProjectDocuments(id);
  const changes = await getChangeRequests(id);

  return NextResponse.json({
    ...project,
    team,
    stages,
    tasks,
    requirements,
    documents,
    changes
  });
}
