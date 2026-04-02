import { db } from "../config/db";
import { zaps, actions, zapRuns } from "../../db/schema";
import { eq, asc } from "drizzle-orm";
import { logger } from "./logger";
import axios from "axios";

export interface ZapExecutionPayload {
  [key: string]: any;
}

/**
 * Core utility to execute a Zap's actions based on a trigger payload.
 */
export async function executeZap(zapId: string, triggerPayload: any) {
  logger.info(`⚡ Starting execution for Zap: ${zapId}`);

  // 1. Fetch Zap and its actions
  const zap = await db.query.zaps.findFirst({
    where: eq(zaps.id, zapId),
    with: {
      actions: {
        orderBy: [asc(actions.sortingOrder)],
      },
    },
  });

  if (!zap || zap.status !== "active") {
    logger.warn(`Zap ${zapId} not found or inactive.`);
    return;
  }

  // 2. Create Execution Log Entry
  const runId = Math.random().toString(36).substring(7);
  await db.insert(zapRuns).values({
    id: runId,
    zapId: zap.id,
    metadata: { triggerData: triggerPayload },
    status: "running",
    startedAt: new Date(),
  });

  const results: any[] = [];
  let success = true;

  // 3. Execute Actions sequentially
  for (const action of zap.actions) {
    try {
      logger.info(`   - Executing action: ${action.type} (${action.id})`);
      const result = await runAction(action.type, action.metadata, triggerPayload);
      results.push({ actionId: action.id, status: "success", result });
    } catch (error: any) {
      logger.error(`   - Action failed: ${action.type}`, { error: error.message });
      results.push({ actionId: action.id, status: "failed", error: error.message });
      success = false;
      break; // Stop execution on first failure
    }
  }

  // 4. Update Final Status
  await db.update(zapRuns)
    .set({
      status: success ? "success" : "failed",
      metadata: { triggerData: triggerPayload, actionResults: results },
      completedAt: new Date(),
    })
    .where(eq(zapRuns.id, runId));

  logger.info(`✅ Zap ${zapId} finished with status: ${success ? "SUCCESS" : "FAILED"}`);
  return { runId, success };
}

/**
 * Dispatcher for different action types
 */
async function runAction(type: string, metadata: any, payload: any) {
  // Simple check: replace placeholders like {{field}} with actual data from payload
  const interpolate = (str: string) => {
    return str.replace(/\{\{(.*?)\}\}/g, (_, key) => payload[key.trim()] || "");
  };

  switch (type) {
    case "slack":
      return await sendSlackMessage(metadata.webhookUrl, interpolate(metadata.message || "Zap triggered!"));
    case "discord":
      return await sendDiscordMessage(metadata.webhookUrl, interpolate(metadata.message || "Zap triggered!"));
    case "email":
      return await sendEmail(metadata.to, interpolate(metadata.subject || "Zappy Alert"), interpolate(metadata.body || "Zap triggered!"));
    default:
      throw new Error(`Unsupported action type: ${type}`);
  }
}

/**
 * Integration: Slack
 */
async function sendSlackMessage(webhookUrl: string, text: string) {
  if (!webhookUrl) throw new Error("Slack Webhook URL missing");
  await axios.post(webhookUrl, { text });
  return { delivered: true };
}

/**
 * Integration: Discord
 */
async function sendDiscordMessage(webhookUrl: string, content: string) {
  if (!webhookUrl) throw new Error("Discord Webhook URL missing");
  await axios.post(webhookUrl, { content });
  return { delivered: true };
}

/**
 * Integration: Email (Resend placeholder - requires API key)
 */
async function sendEmail(to: string, subject: string, body: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
     // For demo purposes, we log it if no key is found
     logger.warn("Resend API Key missing. Skipping email send but marking as success for demo.");
     return { simulated: true, to, subject };
  }
  
  await axios.post("https://api.resend.com/emails", {
    from: "Zappy <onboarding@resend.dev>",
    to,
    subject,
    html: body,
  }, {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` }
  });
  
  return { delivered: true };
}
