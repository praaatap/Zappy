import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { zaps, triggers, actions, zapRuns } from "@/lib/db/schema";
import jwt from "jsonwebtoken";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const SECRET = process.env.JWT_SECRET || "zappy-secret-change-in-production";

function getUserId(req: Request): number | null {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return null;
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    try {
        const decoded = jwt.verify(token, SECRET) as { id: number };
        return decoded.id;
    } catch (e) {
        return null;
    }
}

// GET /api/v1/zap/[id] - Get a specific zap
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        const zap = await db.query.zaps.findFirst({
            where: and(eq(zaps.id, id), eq(zaps.userId, userId)),
            with: {
                trigger: true,
                actions: true,
                runs: true,
            }
        });

        if (!zap) return NextResponse.json({ message: "Zap not found" }, { status: 404 });

        return NextResponse.json({ zap });
    } catch (e: any) {
        console.error("Error fetching zap:", e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// PUT /api/v1/zap/[id] - Update a zap
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const body = await req.json();
        
        const zap = await db.query.zaps.findFirst({
            where: and(eq(zaps.id, id), eq(zaps.userId, userId))
        });

        if (!zap) return NextResponse.json({ message: "Zap not found" }, { status: 404 });

        const { name, description, status, trigger: requestedTrigger, actions: requestedActions } = body;

        // Update Zap core fields
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        updateData.updatedAt = new Date();

        await db.update(zaps).set(updateData).where(eq(zaps.id, id));

        // Update Trigger
        if (requestedTrigger) {
            // Check if existing trigger
            const existingTrigger = await db.query.triggers.findFirst({
                where: eq(triggers.zapId, id)
            });

            if (existingTrigger) {
                await db.update(triggers)
                    .set({
                        type: requestedTrigger.type,
                        metadata: requestedTrigger.metadata || {}
                    })
                    .where(eq(triggers.id, existingTrigger.id));
            } else {
                const triggerId = uuidv4();
                await db.insert(triggers).values({
                    id: triggerId,
                    zapId: id,
                    type: requestedTrigger.type,
                    metadata: requestedTrigger.metadata || {}
                });
                await db.update(zaps).set({ triggerId: triggerId }).where(eq(zaps.id, id));
            }
        }

        // Update Actions
        if (requestedActions && Array.isArray(requestedActions)) {
            // For simplicity, delete old actions and recreate them
            await db.delete(actions).where(eq(actions.zapId, id));

            for (let i = 0; i < requestedActions.length; i++) {
                const action = requestedActions[i];
                await db.insert(actions).values({
                    id: uuidv4(),
                    zapId: id,
                    type: action.type,
                    metadata: action.metadata || {},
                    sortingOrder: i
                });
            }
        }

        return NextResponse.json({ message: "Zap updated successfully" });
    } catch (e: any) {
        console.error("Error updating zap:", e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE /api/v1/zap/[id] - Delete a zap
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // ... Check auth
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        
        const zap = await db.query.zaps.findFirst({
            where: and(eq(zaps.id, id), eq(zaps.userId, userId))
        });

        if (!zap) return NextResponse.json({ message: "Zap not found" }, { status: 404 });

        // Delete dependencies first
        await db.delete(zapRuns).where(eq(zapRuns.zapId, id));
        await db.delete(actions).where(eq(actions.zapId, id));
        await db.delete(triggers).where(eq(triggers.zapId, id));
        
        // Delete zap
        await db.delete(zaps).where(eq(zaps.id, id));

        return NextResponse.json({ message: "Zap deleted successfully" });
    } catch (e: any) {
        console.error("Error deleting zap:", e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
