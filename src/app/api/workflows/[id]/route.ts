import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { zaps, triggers, actions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import { syncUser } from "@/lib/authSync";

// GET /api/workflows/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = await syncUser();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const zap = await db.query.zaps.findFirst({
            where: and(eq(zaps.id, params.id), eq(zaps.userId, userId)),
            with: {
                trigger: true,
                actions: true,
            },
        });

        if (!zap) return NextResponse.json({ error: "Zap not found" }, { status: 404 });
        
        return NextResponse.json({ workflow: zap, zap });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// PUT /api/workflows/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = await syncUser();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();

        const [existingZap] = await db.select().from(zaps).where(and(eq(zaps.id, params.id), eq(zaps.userId, userId))).limit(1);
        if (!existingZap) return NextResponse.json({ error: "Zap not found" }, { status: 404 });

        await db.update(zaps)
            .set({ ...body, updatedAt: new Date() })
            .where(eq(zaps.id, params.id));
            
        return NextResponse.json({ message: "Zap updated successfully" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// DELETE /api/workflows/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = await syncUser();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const [existingZap] = await db.select().from(zaps).where(and(eq(zaps.id, params.id), eq(zaps.userId, userId))).limit(1);
        if (!existingZap) return NextResponse.json({ error: "Zap not found" }, { status: 404 });

        await db.transaction(async (tx) => {
            await tx.delete(actions).where(eq(actions.zapId, params.id));
            await tx.delete(triggers).where(eq(triggers.zapId, params.id));
            await tx.delete(zaps).where(eq(zaps.id, params.id));
        });

        return NextResponse.json({ message: "Zap deleted successfully" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
