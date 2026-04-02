import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { getWorkflowsByUser, createWorkflow } from "@/lib/appwrite";

// GET /api/workflows
export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const workflows = await getWorkflowsByUser(userId);
        
        return NextResponse.json({ workflows, zaps: workflows });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST /api/workflows
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { name, description, trigger, actions: initialActions } = await req.json();

        const workflow = await createWorkflow(
            userId,
            name || "Untitled Workflow",
            trigger || { type: "webhook", config: {} },
            initialActions || []
        );
        
        return NextResponse.json({ workflow }, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
