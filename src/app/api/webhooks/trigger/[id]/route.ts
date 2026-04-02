import { NextResponse, NextRequest } from "next/server";
import { appwriteDB, DATABASE_ID, COLLECTIONS, createExecution, AppwriteWorkflow } from "@/lib/appwrite";
import { executeWorkflow } from "@/lib/workflowEngine";

// POST /api/webhooks/trigger/[id]
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await req.json().catch(() => ({}));
        const { id } = await params;
        const workflowId = id;

        // Get the workflow
        const workflow = await appwriteDB.getDocument(
            DATABASE_ID,
            COLLECTIONS.WORKFLOWS,
            workflowId
        ).catch(() => null) as AppwriteWorkflow | null;

        if (!workflow) {
            return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
        }

        if (workflow.status !== "active") {
            return NextResponse.json({ error: "Workflow is not active" }, { status: 400 });
        }

        // Create execution record
        const execution = await createExecution(
            workflow.$id,
            workflow.userId,
            payload
        );

        // Execute the workflow asynchronously (fire and forget)
        executeWorkflow(workflow, payload, execution.$id).catch((err) => {
            console.error("Workflow execution error:", err);
        });

        return NextResponse.json({
            message: "Workflow triggered successfully",
            executionId: execution.$id,
            success: true
        }, { status: 200 });

    } catch (e: any) {
        console.error("Webhook trigger error:", e);
        return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
    }
}
