import { createTask } from "@/lib/tasks";
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from "next/server";

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
