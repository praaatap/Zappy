import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { appwriteDB, DATABASE_ID, COLLECTIONS, updateWorkflow } from "@/lib/appwrite";

// GET /api/workflows/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        
        // Get the workflow from Appwrite
        const workflow = await appwriteDB.getDocument(
            DATABASE_ID,
            COLLECTIONS.WORKFLOWS,
            id
        ).catch(() => null);

        if (!workflow || workflow.userId !== userId) {
            return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
        }
        
        return NextResponse.json({ workflow, zap: workflow });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// PUT /api/workflows/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const body = await req.json();

        const existingZap = await appwriteDB.getDocument(
            DATABASE_ID,
            COLLECTIONS.WORKFLOWS,
            id
        ).catch(() => null);
        
        if (!existingZap || existingZap.userId !== userId) return NextResponse.json({ error: "Workflow not found" }, { status: 404 });

        await updateWorkflow(id, body);
            
        return NextResponse.json({ message: "Workflow updated successfully" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// DELETE /api/workflows/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        
        const existingZap = await appwriteDB.getDocument(
            DATABASE_ID,
            COLLECTIONS.WORKFLOWS,
            id
        ).catch(() => null);
        
        if (!existingZap || existingZap.userId !== userId) return NextResponse.json({ error: "Workflow not found" }, { status: 404 });

        await appwriteDB.deleteDocument(DATABASE_ID, COLLECTIONS.WORKFLOWS, id);

        return NextResponse.json({ message: "Workflow deleted successfully" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
