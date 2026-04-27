import { createRequirement, approveRequirement, rejectRequirement } from "@/lib/requirement";
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, content, projectId, createdBy } = await req.json();
    
    if (!title || !projectId || !createdBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = `r_${uuidv4().slice(0, 12)}`;
    createRequirement(id, title, content, projectId, createdBy);
    
    return NextResponse.json({ id, message: "Requirement created successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create requirement" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, action, userId } = await req.json();
    
    if (action === 'approve') {
      approveRequirement(id, userId);
    } else if (action === 'reject') {
      rejectRequirement(id);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    
    return NextResponse.json({ message: `Requirement ${action}d successfully` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update requirement" }, { status: 500 });
  }
}
