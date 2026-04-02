import { Router, Request, Response } from "express";
import { db } from "../../core/config/db";
import { users } from "../../db/schema";
import { authMiddleware } from "../middlewares/auth";
import { asyncHandler, logger } from "../middlewares/errorHandler";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * Sync user profile or get existing profile from our DB using Clerk User ID
 */
router.get("/me", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).auth.userId;

  let [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  // If user doesn't exist in our DB, we sync them from the request header (or wait for webhook)
  // For now, let's just return what we have or a placeholder.
  if (!user) {
    logger.info("User not found in DB, syncing basic info...", { userId });
    // In a real app, you might use clerkClient.users.getUser(userId) here if name/email are needed.
    // For now, we'll assume the user is created via frontend or webhook.
    return res.status(404).json({ error: "User profile not yet synced" });
  }

  res.json({ user });
}));

export default router;