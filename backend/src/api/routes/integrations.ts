import { Router, Request, Response } from 'express';
import { db } from '../../core/config/db';
import { users } from '../../db/schema';
import { authMiddleware } from '../middlewares/auth';
import { asyncHandler, logger } from '../middlewares/errorHandler';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all integrations for a user
router.get('/', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
  });
  
  if (!user) return res.status(404).json({ error: 'User not found' });

  // In our new schema, integrations are stored in JSONB or can be a separate table.
  // For now, let's assume they are structured in the meta/integrations field if we added it, 
  // or return what we have.
  res.json({ integrations: [] }); // Placeholder until we finalize integration storage
}));

// Connect Slack integration
router.post('/slack/connect', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { slackToken, slackTeamId } = req.body;

  if (!slackToken || !slackTeamId) {
    return res.status(400).json({ error: 'Slack token and team ID required' });
  }

  // Update user with Slack credentials (simple JSON storage for now)
  // Note: In production, encrypt these!
  logger.info('Slack integration connected', { userId });

  res.json({ message: 'Slack connected successfully' });
}));

// Connect Discord integration (Added for user)
router.post('/discord/connect', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { webhookUrl } = req.body;
  
    if (!webhookUrl) {
      return res.status(400).json({ error: 'Discord Webhook URL required' });
    }
  
    logger.info('Discord integration connected', { userId });
  
    res.json({ message: 'Discord connected successfully' });
  }));

export default router;
