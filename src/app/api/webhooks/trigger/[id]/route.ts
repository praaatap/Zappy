import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { zaps, triggers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { executeZap } from "@/lib/zapExecutor";

// POST /api/webhooks/trigger/[id]
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const payload = await req.json().catch(() => ({}));

        const zapId = params.id;

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
            message: "Zap triggered successfully",
            runId: result?.runId,
            success: result?.success
        }, { status: 200 });

    } catch (e: any) {
        console.error("Webhook trigger error:", e);
        return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
    }
}
