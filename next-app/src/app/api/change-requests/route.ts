import { createChangeRequest, approveChangeRequest, rejectChangeRequest } from "@/lib/changes";
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, description, projectId, requestedBy } = await req.json();
    
    if (!title || !projectId || !requestedBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = `cr_${uuidv4().slice(0, 12)}`;
    await createChangeRequest(id, title, description, projectId, requestedBy);
    
    return NextResponse.json({ id, message: "Change request raised successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create change request" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, action, userId, impact, rejectionReason } = await req.json();
    
    if (action === 'approve') {
      await approveChangeRequest(id, userId, impact);
    } else if (action === 'reject') {
      await rejectChangeRequest(id, rejectionReason);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    
    return NextResponse.json({ message: `Change request ${action}d successfully` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update change request" }, { status: 500 });
  }
}
