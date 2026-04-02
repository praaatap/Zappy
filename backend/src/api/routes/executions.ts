import { Router, Request, Response } from 'express';
import { db } from '../../core/config/db';
import { zapRuns } from '../../db/schema';
import { authMiddleware } from '../middlewares/auth';
import { asyncHandler } from '../middlewares/errorHandler';
import { eq, desc } from 'drizzle-orm';

const router = Router();

// Get executions for a zap
router.get('/:zapId', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const { zapId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const runs = await db.query.zapRuns.findMany({
        where: eq(zapRuns.zapId, zapId as string),
        orderBy: [desc(zapRuns.startedAt)],
        limit: limit,
    });
    
    res.json({ executions: runs });
}));

export default router;
