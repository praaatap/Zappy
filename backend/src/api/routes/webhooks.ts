import { Router, Request, Response } from "express";
import { db } from "../../core/config/db";
import { zaps } from "../../db/schema";
import { eq } from "drizzle-orm";
import { executeZap } from "../../core/utils/zapExecutor";
import { asyncHandler, logger } from "../middlewares/errorHandler";

const router = Router();

/**
 * Webhook endpoint to trigger a workflow
 * POST /api/v1/webhooks/trigger/:zapId
 */
router.post("/trigger/:zapId", asyncHandler(async (req: Request, res: Response) => {
    const { zapId } = req.params;
    const payload = req.body;

    logger.info(`Received trigger for Zap: ${zapId}`);

    // 1. Fetch the Zap to ensure it exists and is active
    // Use type casting to avoid TS errors with string | string[]
    const actualZapId = zapId as string;

    const zap = await db.query.zaps.findFirst({
        where: eq(zaps.id, actualZapId),
    });

    if (!zap) {
        return res.status(404).json({ error: "Zap not found" });
    }

    if (zap.status !== "active") {
        return res.status(400).json({ error: "Zap is not active" });
    }

    // 2. Synchronous/Immediate execution (Serverless compatible)
    const result = await executeZap(actualZapId, payload);

    res.status(200).json({
        message: "Zap triggered successfully",
        runId: result?.runId,
        success: result?.success
    });
}));

export default router;
