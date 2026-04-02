import { createClerkClient } from "@clerk/clerk-sdk-node";
import { Request, Response, NextFunction } from "express";
import { config } from "../../core/config/environment";
import { logger } from "../../core/utils/logger";

const clerkClient = createClerkClient({
  secretKey: config.CLERK_SECRET_KEY,
  publishableKey: config.CLERK_PUBLISHABLE_KEY,
});

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing token" });
    }

    const token = authHeader.split(" ")[1];
    const sessionClaims = await clerkClient.verifyToken(token);

    if (!sessionClaims) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Attach user info to request
    (req as any).auth = {
      userId: sessionClaims.sub,
    };

    next();
  } catch (error) {
    logger.error("Auth Error:", { error });
    res.status(401).json({ error: "Unauthorized: Authentication failed" });
  }
};
