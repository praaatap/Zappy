import { Router, Request, Response } from 'express';
import { db } from '../../core/config/db';
import { zaps, triggers, actions } from '../../db/schema';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth';
import { asyncHandler } from '../middlewares/errorHandler';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Create a zap (Legacy endpoint)
router.post('/', optionalAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const { triggerId, actions: initialActions, name } = req.body;
    const userId = (req as any).userId || 'guest';

    const zapId = uuidv4();
    const newZap = {
        id: zapId,
        name: name || 'Untitled Zap',
        userId: userId,
        status: 'active' as const,
    };

    await db.transaction(async (tx) => {
        await tx.insert(zaps).values(newZap);
        
        await tx.insert(triggers).values({
            id: uuidv4(),
            zapId: zapId,
            type: triggerId || 'webhook',
            metadata: {},
        });

        if (Array.isArray(initialActions)) {
            for (let i = 0; i < initialActions.length; i++) {
                await tx.insert(actions).values({
                    id: uuidv4(),
                    zapId: zapId,
                    type: initialActions[i].actionId || initialActions[i].type || 'unknown',
                    metadata: initialActions[i].metadata || {},
                    sortingOrder: i,
                });
            }
        }
    });

    res.status(201).json({ id: zapId, zap: newZap });
}));

// Get Zaps
router.get('/', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const userZaps = await db.query.zaps.findMany({
        where: eq(zaps.userId, userId),
        with: {
            trigger: true,
            actions: true,
        },
    });
    res.json({ zaps: userZaps });
}));

// Get single Zap
router.get('/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const zap = await db.query.zaps.findFirst({
        where: and(eq(zaps.id, req.params.id as string), eq(zaps.userId, userId)),
        with: {
            trigger: true,
            actions: true,
        },
    });
    if (!zap) return res.status(404).json({ error: 'Not found' });
    res.json({ zap });
}));

export default router;
