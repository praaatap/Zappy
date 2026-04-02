import { NextResponse } from "next/server";

import { db } from "@/db";
import { zaps, triggers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { executeZap } from "@/lib/zapExecutor";

// POST /api/hooks/catch/[zapId] - Execute internal webhook
export async function POST(
    req: Request,
    { params }: { params: { zapId: string } }
) {
    try {
        const { zapId } = params;
        const payload = await req.json().catch(() => ({}));

        // Try to find the zap directly (if id is zapId)
        let zap = await db.query.zaps.findFirst({
            where: eq(zaps.id, zapId),
        });

        // Or if the id is actually a trigger ID
        if (!zap) {
            const trigger = await db.query.triggers.findFirst({
                where: eq(triggers.id, zapId),
            });

            if (trigger) {
                zap = await db.query.zaps.findFirst({
                    where: eq(zaps.id, trigger.zapId),
                });
            }
        }

        if (!zap) {
            return NextResponse.json({ error: "Zap not found" }, { status: 404 });
        }

        if (zap.status !== "active") {
            return NextResponse.json({ error: "Zap is not active" }, { status: 400 });
        }

        // Execute Zap synchronously on Vercel Edge/Serverless
        const result = await executeZap(zap.id, payload);

        return NextResponse.json({
            success: true,
            message: "Webhook triggered successfully",
            executionId: result?.runId
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
    { params }: { params: { zapId: string } }
) {
    const { zapId } = params;
    return NextResponse.json({
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/hooks/catch/${zapId}`,
        zapId,
        status: "active"
    });
}
