import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStats } from "@/lib/appwrite";

// GET /api/v1/stats
export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const stats = await getStats(userId);

        return NextResponse.json({
            stats: {
                totalWorkflows: stats.activeWorkflows + (stats.totalExecutions ? stats.totalExecutions / 10 : 0),
                activeWorkflows: stats.activeWorkflows,
                successRate: stats.successRate,
                totalExecutions: stats.totalExecutions,
            }
        });
    } catch (e: any) {
        console.error("Stats API error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
