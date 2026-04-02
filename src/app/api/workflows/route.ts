import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { zaps, triggers, actions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@clerk/nextjs/server";

import { syncUser } from "@/lib/authSync";

// GET /api/workflows
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
        
        return NextResponse.json({ workflows: userZaps, zaps: userZaps });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST /api/workflows
export async function POST(req: NextRequest) {
    try {
        const userId = await syncUser();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { name, description, trigger, actions: initialActions } = await req.json();

        const zapId = uuidv4();
        const newZap = {
            id: zapId,
            name: name || "Untitled Zap",
            description: description || "",
            status: "paused",
            userId: userId,
        };

        await db.transaction(async (tx) => {
            await tx.insert(zaps).values(newZap);

            if (trigger) {
                const triggerId = uuidv4();
                await tx.insert(triggers).values({
                    id: triggerId,
                    zapId: zapId,
                    type: trigger.type || "webhook",
                    metadata: trigger.metadata || trigger.config || {},
                });
                await tx.update(zaps).set({ triggerId }).where(eq(zaps.id, zapId));
            }

            if (initialActions && Array.isArray(initialActions)) {
                for (let i = 0; i < initialActions.length; i++) {
                    await tx.insert(actions).values({
                        id: uuidv4(),
                        zapId: zapId,
                        type: initialActions[i].type || initialActions[i].actionId || "unknown",
                        metadata: initialActions[i].metadata || initialActions[i].config || {},
                        sortingOrder: i,
                    });
                }
            }
        });
        
        return NextResponse.json({ workflow: { ...newZap, trigger, actions: initialActions } }, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
