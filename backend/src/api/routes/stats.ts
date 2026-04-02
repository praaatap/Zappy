import { Router, Request, Response } from 'express';
import { db } from '../../core/config/db';
import { zaps, zapRuns } from '../../db/schema';
import { authMiddleware } from '../middlewares/auth';
import { asyncHandler } from '../middlewares/errorHandler';
import { eq, and, desc, count } from 'drizzle-orm';

const router = Router();

// Get Dashboard Analytics/Stats
router.get('/', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    // Get total zaps, active zaps
    const [totalZapsResult] = await db.select({ value: count() }).from(zaps).where(eq(zaps.userId, userId));
    const [activeZapsResult] = await db.select({ value: count() }).from(zaps).where(and(eq(zaps.userId, userId), eq(zaps.status, 'active')));
    
    // Get recent executions
    const recentExecutions = await db.query.zapRuns.findMany({
        where: eq(zapRuns.zapId, db.select({ id: zaps.id }).from(zaps).where(eq(zaps.userId, userId))),
        orderBy: [desc(zapRuns.startedAt)],
        limit: 5,
        with: {
            zap: true,
        },
    });

    // Calculate success rate over the last 100 executions for this user's zaps
    const last100 = await db.query.zapRuns.findMany({
        where: eq(zapRuns.zapId, db.select({ id: zaps.id }).from(zaps).where(eq(zaps.userId, userId))),
        orderBy: [desc(zapRuns.startedAt)],
        limit: 100,
    });

    const successful = last100.filter((log: any) => log.status === 'success').length;
    const successRate = last100.length > 0 ? (successful / last100.length) * 100 : 100;

    res.json({
        stats: {
            totalWorkflows: totalZapsResult.value,
            activeWorkflows: activeZapsResult.value,
            successRate: Math.round(successRate),
            totalExecutions: last100.length,
        },
        recentExecutions
    });
}));

export default router;
