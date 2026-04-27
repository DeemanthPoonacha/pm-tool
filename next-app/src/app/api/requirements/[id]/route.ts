import { getRequirement, getRequirementVersions } from "@/lib/requirement";
import { NextResponse } from "next/server";
import { getProject } from "@/lib/projects";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const requirement = getRequirement(id);
  
  if (!requirement) {
    return NextResponse.json({ error: "Requirement not found" }, { status: 404 });
  }

  const project = getProject(requirement.project_id);
  const versions = getRequirementVersions(id);

  return NextResponse.json({
    ...requirement,
    project,
    versions
  });
}
