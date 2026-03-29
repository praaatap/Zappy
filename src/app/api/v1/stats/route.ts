import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { zaps, zapRuns } from "@/lib/db/schema";
import jwt from "jsonwebtoken";
import { eq, sql, count, desc, and } from "drizzle-orm";

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

export async function GET(req: Request) {
    try {
        const userId = getUserId(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Get total active zaps
        const [activeZapsCount] = await db
            .select({ count: count() })
            .from(zaps)
            .where(and(eq(zaps.userId, userId), eq(zaps.status, "active")));

        // Get total runs
        const [totalRunsCount] = await db
            .select({ count: count() })
            .from(zapRuns)
            .innerJoin(zaps, eq(zapRuns.zapId, zaps.id))
            .where(eq(zaps.userId, userId));

        // Get success rate (mocking some logic but based on real data)
        const [failedRunsCount] = await db
            .select({ count: count() })
            .from(zapRuns)
            .innerJoin(zaps, eq(zapRuns.zapId, zaps.id))
            .where(and(eq(zaps.userId, userId), eq(zapRuns.status, "failed")));

        const totalCount = Number(totalRunsCount.count);
        const failedCount = Number(failedRunsCount.count);
        const successRate = totalCount > 0 
            ? ((totalCount - failedCount) / totalCount * 100).toFixed(1)
            : "100.0";

        // Get recent activity
        const activity = await db.query.zapRuns.findMany({
            with: {
                zap: true
            },
            orderBy: [desc(zapRuns.startedAt)],
            limit: 10,
        });

        // Filter activity for the user
        const userActivity = activity
          .filter(run => run.zap.userId === userId)
          .map(run => ({
            title: `Zap triggered: ${run.zap.name}`,
            zap: run.zap.name,
            time: run.startedAt,
            status: run.status
          }));

        return NextResponse.json({
            stats: {
                activeZaps: activeZapsCount.count,
                totalRuns: totalRunsCount.count,
                successRate: `${successRate}%`,
                taskUsage: "Normal"
            },
            activity: userActivity
        });
    } catch (e: any) {
        console.error("Stats error:", e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
