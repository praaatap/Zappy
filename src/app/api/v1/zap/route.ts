import { NextResponse } from "next/server";
import { db } from "@/db";
import { zaps, triggers, actions } from "@/db/schema";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

const SECRET = "supersecret123";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { availableTriggerId, triggerMetadata, actions: requestedActions } = body;

        // 1. Auth Check
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let userId: number;
        try {
            const decoded = jwt.verify(authHeader, SECRET) as { id: number };
            userId = decoded.id;
        } catch (e) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        // 2. Start Transaction (Drizzle doesn't support easy transactions in all drivers, doing sequential for now as simple implementation)
        const zapId = uuidv4();

        // Create Zap
        await db.insert(zaps).values({
            id: zapId,
            userId: userId,
            triggerId: uuidv4(), // Placeholder, updated below
        });

        // Create Trigger
        const triggerId = uuidv4();
        await db.insert(triggers).values({
            id: triggerId,
            zapId: zapId,
            triggerId: availableTriggerId,
            metadata: triggerMetadata
        });

        // Update Zap with trigger reference
        await db.update(zaps).set({ triggerId: triggerId }).where(eq(zaps.id, zapId));

        // Create Actions
        for (let i = 0; i < requestedActions.length; i++) {
            const action = requestedActions[i];
            await db.insert(actions).values({
                id: uuidv4(),
                zapId: zapId,
                actionId: action.availableActionId,
                metadata: action.actionMetadata,
                sortingOrder: i
            });
        }

        return NextResponse.json({ zapId });

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}