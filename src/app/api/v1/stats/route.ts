import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { zaps, zapRuns } from "@/db/schema";
import { eq, and, desc, count, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import { syncUser } from "@/lib/authSync";

// GET /api/v1/stats
export async function GET(req: NextRequest) {
    try {
        const userId = await syncUser();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Get total zaps, active zaps
        const [totalZapsResult] = await db.select({ value: count() }).from(zaps).where(eq(zaps.userId, userId));
        const [activeZapsResult] = await db.select({ value: count() }).from(zaps).where(and(eq(zaps.userId, userId), eq(zaps.status, 'active')));
        
        // Drizzle nested select isn't supported inside where in the exact same way for eq(coll, SubQuery),
        // we'll fetch the user's zap IDs first to simplify OR we can query zapRuns and join.
        // Let's do a fast join or find the zapIds first for serverless efficiency:
        
        const userZapsResult = await db.select({ id: zaps.id }).from(zaps).where(eq(zaps.userId, userId));
        const userZapIds = userZapsResult.map(z => z.id);

        let recentExecutions: any[] = [];
        let last100: any[] = [];

        if (userZapIds.length > 0) {
            // Wait, drizzle doesn't natively have query.zapRuns.findMany with an array `inArray` if we're not using standard schema syntax? 
            // We can use standard select for this:
            
            // Get recent executions using the standard sql connection if we want simple sorting,
            // or we use drizzle query:
            recentExecutions = await db.query.zapRuns.findMany({
                where: (runs, { inArray }) => inArray(runs.zapId, userZapIds),
                orderBy: [desc(zapRuns.startedAt)],
                limit: 5,
                with: { zap: true },
            });

            last100 = await db.query.zapRuns.findMany({
                where: (runs, { inArray }) => inArray(runs.zapId, userZapIds),
                orderBy: [desc(zapRuns.startedAt)],
                limit: 100,
            });
        }

        const successful = last100.filter((log: any) => log.status === 'success').length;
        const successRate = last100.length > 0 ? (successful / last100.length) * 100 : 100;

        return NextResponse.json({
            stats: {
                totalWorkflows: totalZapsResult.value,
                activeWorkflows: activeZapsResult.value,
                successRate: Math.round(successRate),
                totalExecutions: last100.length,
            },
            recentExecutions
        });

    } catch (e: any) {
        console.error("Stats API error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
