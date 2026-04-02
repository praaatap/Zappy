import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { 
  getWorkflowsByUser, 
  createWorkflow, 
  updateWorkflow,
  appwriteDB,
  DATABASE_ID,
  COLLECTIONS
} from "@/lib/appwrite";
import { ID } from "appwrite";

// GET /api/v1/zap
export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userWorkflows = await getWorkflowsByUser(userId);
        return NextResponse.json({ zaps: userWorkflows });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST /api/v1/zap
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const workflow = await createWorkflow(
            userId,
            body.name || "Untitled Workflow",
            {
                type: body.trigger?.type || body.triggerId || "webhook",
                config: body.trigger?.metadata || body.trigger?.config || {}
            },
            body.actions || []
        );
        
        return NextResponse.json({
            id: workflow.$id,
            zapId: workflow.$id,
            zap: workflow,
            message: "Zap created successfully"
        }, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
