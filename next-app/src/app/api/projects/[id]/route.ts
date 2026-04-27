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
  const project = getProject(id);
  
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const team = getProjectTeam(id);
  const stages = getProjectWorkflowStages(id);
  const tasks = getTasks(id);
  const requirements = getRequirements(id);
  const documents = getProjectDocuments(id);
  const changes = getChangeRequests(id);

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
