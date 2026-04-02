import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { appwriteDB, DATABASE_ID, COLLECTIONS, updateWorkflow, deleteWorkflow } from "@/lib/appwrite";

// GET /api/v1/zap/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        
        const zap = await appwriteDB.getDocument(
            DATABASE_ID,
            COLLECTIONS.WORKFLOWS,
            id
        ).catch(() => null);

        if (!zap || zap.userId !== userId) return NextResponse.json({ error: "Zap not found" }, { status: 404 });
        
        return NextResponse.json({ zap, workflow: zap });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// PUT /api/v1/zap/[id]
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
        
        if (!existingZap || existingZap.userId !== userId) return NextResponse.json({ error: "Zap not found" }, { status: 404 });

        await updateWorkflow(id, { ...body, updatedAt: new Date() });
            
        return NextResponse.json({ message: "Zap updated successfully" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// DELETE /api/v1/zap/[id]
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
        
        if (!existingZap || existingZap.userId !== userId) return NextResponse.json({ error: "Zap not found" }, { status: 404 });

        await appwriteDB.deleteDocument(DATABASE_ID, COLLECTIONS.WORKFLOWS, id);

        return NextResponse.json({ message: "Zap deleted successfully" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
