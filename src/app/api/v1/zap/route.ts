import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { zaps, triggers, actions } from "@/lib/db/schema";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { eq, desc } from "drizzle-orm";

const SECRET = process.env.JWT_SECRET || "zappy-secret-change-in-production";

// Middleware equivalent to get user ID from token
function getUserId(req: Request): number | null {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return null;
    
    // Support "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    try {
        const decoded = jwt.verify(token, SECRET) as { id: number };
        return decoded.id;
    } catch (e) {
        return null;
    }
}

// GET /api/v1/zap - List all zaps for the user
export async function GET(req: Request) {
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Using Drizzle relational queries
        const userZaps = await db.query.zaps.findMany({
            where: eq(zaps.userId, userId),
            orderBy: [desc(zaps.createdAt)],
            with: {
                trigger: true,
                actions: true,
                runs: true,
            }
        });

        const formattedZaps = userZaps.map(zap => ({
            id: zap.id,
            name: zap.name,
            description: zap.description,
            status: zap.status,
            steps: (zap.actions?.length || 0) + (zap.trigger ? 1 : 0),
            runs: zap.runs?.length || 0,
            lastRun: zap.runs?.length ? zap.runs[zap.runs.length - 1].startedAt : "Never",
            trigger: zap.trigger?.type || "Unknown",
            actions: zap.actions || [],
            createdAt: zap.createdAt,
            updatedAt: zap.updatedAt
        }));

        return NextResponse.json({ zaps: formattedZaps });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/v1/zap - Create a new zap
export async function POST(req: Request) {
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { 
            name, 
            description, 
            status,
            trigger: requestedTrigger, 
            actions: requestedActions,
            // Support alternate payload format from available triggers/actions
            availableTriggerId,
            triggerMetadata,
            actions: alternateActions
        } = body;

        const zapId = uuidv4();

        // Create Zap
        await db.insert(zaps).values({
            id: zapId,
            name: name || "Untitled Zap",
            description: description || "",
            status: status || "paused",
            userId: userId,
        });

        // Handle Trigger
        const finalTriggerType = requestedTrigger?.type || availableTriggerId;
        const finalTriggerMetadata = requestedTrigger?.metadata || triggerMetadata || {};

        if (finalTriggerType) {
            const triggerId = uuidv4();
            await db.insert(triggers).values({
                id: triggerId,
                zapId: zapId,
                type: finalTriggerType,
                metadata: finalTriggerMetadata
            });
            // Update Zap with trigger reference
            await db.update(zaps).set({ triggerId: triggerId }).where(eq(zaps.id, zapId));
        }

        // Handle Actions
        const finalActions = requestedActions || alternateActions;
        if (finalActions && Array.isArray(finalActions)) {
            for (let i = 0; i < finalActions.length; i++) {
                const action = finalActions[i];
                await db.insert(actions).values({
                    id: uuidv4(),
                    zapId: zapId,
                    type: action.type || action.availableActionId,
                    metadata: action.metadata || action.actionMetadata || {},
                    sortingOrder: i
                });
            }
        }

        return NextResponse.json({ zapId, message: "Zap created successfully" });
    } catch (e: any) {
        console.error("Create Zap error:", e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
