import { getRequirement, getRequirementVersions } from "@/lib/requirement";
import { NextResponse } from "next/server";
import { getProject } from "@/lib/projects";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const requirement = await getRequirement(id);
  
  if (!requirement) {
    return NextResponse.json({ error: "Requirement not found" }, { status: 404 });
  }

  const project = await getProject(requirement.project_id);
  const versions = await getRequirementVersions(id);

  return NextResponse.json({
    ...requirement,
    project,
    versions
  });
}
