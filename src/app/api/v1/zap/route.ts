import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { zaps, triggers, actions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@clerk/nextjs/server";

import { syncUser } from "@/lib/authSync";

// GET /api/v1/zap
export async function GET(req: NextRequest) {
    try {
        const userId = await syncUser();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userZaps = await db.query.zaps.findMany({
            where: eq(zaps.userId, userId),
            with: {
                trigger: true,
                actions: true,
            },
        });
        
        return NextResponse.json({ zaps: userZaps });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST /api/v1/zap
export async function POST(req: NextRequest) {
    try {
        const userId = await syncUser();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const triggerIdParam = body.triggerId || body.trigger?.type || "webhook";
        const initialActions = body.actions || [];
        const name = body.name;

        const zapId = uuidv4();
        const newZap = {
            id: zapId,
            name: name || "Untitled Zap",
            description: body.description || "",
            status: body.status || "active",
            userId: userId,
        };

        await db.transaction(async (tx) => {
            await tx.insert(zaps).values(newZap);

            const triggerRecordId = uuidv4();
            await tx.insert(triggers).values({
                id: triggerRecordId,
                zapId: zapId,
                type: triggerIdParam,
                metadata: body.trigger?.metadata || body.trigger?.config || {},
            });
            await tx.update(zaps).set({ triggerId: triggerRecordId }).where(eq(zaps.id, zapId));

            if (initialActions && Array.isArray(initialActions)) {
                for (let i = 0; i < initialActions.length; i++) {
                    await tx.insert(actions).values({
                        id: uuidv4(),
                        zapId: zapId,
                        type: initialActions[i].actionId || initialActions[i].type || "unknown",
                        metadata: initialActions[i].metadata || initialActions[i].config || {},
                        sortingOrder: i,
                    });
                }
            }
        });
        
        return NextResponse.json({ id: zapId, zapId, zap: newZap, message: "Zap created successfully" }, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
