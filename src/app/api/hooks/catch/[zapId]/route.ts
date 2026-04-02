import { NextResponse } from "next/server";
import { appwriteDB, DATABASE_ID, COLLECTIONS, createExecution, AppwriteWorkflow } from "@/lib/appwrite";
import { executeWorkflow } from "@/lib/workflowEngine";

// POST /api/hooks/catch/[zapId] - Execute internal webhook
export async function POST(
    req: Request,
    { params }: { params: Promise<{ zapId: string }> }
) {
    try {
        const { zapId } = await params;
        const payload = await req.json().catch(() => ({}));

        // Get the workflow from Appwrite
        const workflow = await appwriteDB.getDocument(
            DATABASE_ID,
            COLLECTIONS.WORKFLOWS,
            zapId
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
            success: true,
            message: "Webhook triggered successfully",
            executionId: execution.$id
        });
    } catch (e: any) {
        console.error("Webhook error:", e);
        return NextResponse.json({ 
            error: "Failed to trigger webhook",
            message: e.message 
        }, { status: 500 });
    }
}

// GET - Return webhook info
export async function GET(
    req: Request,
    { params }: { params: Promise<{ zapId: string }> }
) {
    const { zapId } = await params;
    return NextResponse.json({
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/hooks/catch/${zapId}`,
        zapId,
        status: "active"
    });
}
