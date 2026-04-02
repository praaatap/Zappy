import { Router, Request, Response } from "express";
import { db } from "../../core/config/db";
import { zaps, triggers, actions } from "../../db/schema";
import { requireAuth } from "../middlewares/clerk";
import { asyncHandler } from "../middlewares/errorHandler";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Get all zaps for a user
router.get("/", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).auth.userId;
    
    const userZaps = await db.query.zaps.findMany({
        where: eq(zaps.userId, userId),
        with: {
            trigger: true,
            actions: true,
        },
    });
    res.json({ workflows: userZaps });
}));

// Get single zap with all details
router.get("/:id", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).auth.userId;
    const { id } = req.params;

    const zap = await db.query.zaps.findFirst({
        where: and(eq(zaps.id, id as string), eq(zaps.userId, userId)),
        with: {
            trigger: true,
            actions: true,
        },
    });

    if (!zap) {
        return res.status(404).json({ error: "Zap not found" });
    }
    
    res.json({ workflow: zap });
}));

// Create a new Zap with optional trigger and actions
router.post("/", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).auth.userId;
    const { name, description, trigger, actions: initialActions } = req.body;

    const zapId = uuidv4();
    const newZap = {
        id: zapId,
        name: name || "Untitled Zap",
        description: description || "",
        status: "paused",
        userId: userId,
    };

    await db.transaction(async (tx) => {
        await tx.insert(zaps).values(newZap);

        if (trigger) {
            const triggerId = uuidv4();
            await tx.insert(triggers).values({
                id: triggerId,
                zapId: zapId,
                type: trigger.type,
                metadata: trigger.metadata || {},
            });
            await tx.update(zaps).set({ triggerId }).where(eq(zaps.id, zapId));
        }

        if (initialActions && Array.isArray(initialActions)) {
            for (let i = 0; i < initialActions.length; i++) {
                await tx.insert(actions).values({
                    id: uuidv4(),
                    zapId: zapId,
                    type: initialActions[i].type,
                    metadata: initialActions[i].metadata || {},
                    sortingOrder: i,
                });
            }
        }
    });
    
    res.status(201).json({ workflow: { ...newZap, trigger, actions: initialActions } });
}));

// Update zap status or basic info
router.put("/:id", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).auth.userId;
    const { id } = req.params;

    const [existingZap] = await db.select().from(zaps).where(and(eq(zaps.id, id as string), eq(zaps.userId, userId))).limit(1);
    if (!existingZap) return res.status(404).json({ error: "Zap not found" });

    await db.update(zaps)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(zaps.id, id as string));
        
    res.json({ message: "Zap updated successfully" });
}));

// Delete zap
router.delete("/:id", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).auth.userId;
    const { id } = req.params;

    // First check ownership
    const [existingZap] = await db.select().from(zaps).where(and(eq(zaps.id, id as string), eq(zaps.userId, userId))).limit(1);
    if (!existingZap) return res.status(404).json({ error: "Zap not found" });

    await db.transaction(async (tx) => {
        await tx.delete(actions).where(eq(actions.zapId, id as string));
        await tx.delete(triggers).where(eq(triggers.zapId, id as string));
        await tx.delete(zaps).where(eq(zaps.id, id as string));
    });

    res.json({ message: "Zap deleted successfully" });
}));

export default router;
