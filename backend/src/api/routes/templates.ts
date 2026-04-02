import { Router, Request, Response } from 'express';
import { db } from '../../core/config/db';
import { zaps, triggers, actions } from '../../db/schema';
import { authMiddleware } from '../middlewares/auth';
import { asyncHandler } from '../middlewares/errorHandler';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get all available templates
router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const templates = await db.query.zaps.findMany({
        where: eq(zaps.isTemplate, "true"),
        with: {
            trigger: true,
            actions: true,
        },
    });
    res.json({ templates });
}));

// Use a template to create a new zap
router.post('/:id/use', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;

    const template = await db.query.zaps.findFirst({
        where: and(eq(zaps.id, id as string), eq(zaps.isTemplate, "true")),
        with: {
            trigger: true,
            actions: true,
        },
    });

    if (!template) {
        return res.status(404).json({ error: 'Template not found' });
    }

    const newZapId = uuidv4();
    const newZap = {
        id: newZapId,
        name: `${template.name} (Copy)`,
        description: template.description,
        userId: userId,
        status: 'paused' as const,
    };

    await db.transaction(async (tx) => {
        await tx.insert(zaps).values(newZap);
        
        if (template.trigger) {
            const triggerId = uuidv4();
            await tx.insert(triggers).values({
                id: triggerId,
                zapId: newZapId,
                type: template.trigger.type,
                metadata: template.trigger.metadata || {},
            });
            await tx.update(zaps).set({ triggerId }).where(eq(zaps.id, newZapId));
        }

        for (let i = 0; i < template.actions.length; i++) {
            await tx.insert(actions).values({
                id: uuidv4(),
                zapId: newZapId,
                type: template.actions[i].type,
                metadata: template.actions[i].metadata || {},
                sortingOrder: i,
            });
        }
    });

    res.status(201).json({ workflow: newZap });
}));

export default router;
