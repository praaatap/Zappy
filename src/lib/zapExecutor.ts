import { 
  getWorkflowById,
  createExecution, 
  updateExecutionStatus,
  appwriteDB,
  DATABASE_ID,
  COLLECTIONS
} from "@/lib/appwrite";
import axios from "axios";

export interface ZapExecutionPayload {
  [key: string]: any;
}

/**
 * Core utility to execute a Zap's actions based on a trigger payload.
 */
export async function executeZap(zapId: string, triggerPayload: any, userId?: string) {
  console.log(`⚡ Starting execution for Zap: ${zapId}`);

  // 1. Fetch Workflow and its actions
  try {
    const workflow = await appwriteDB.getDocument(
      DATABASE_ID,
      COLLECTIONS.WORKFLOWS,
      zapId
    );

    if (!workflow || workflow.status !== "active") {
      console.warn(`Zap ${zapId} not found or inactive.`);
      return;
    }

    // 2. Create Execution Log Entry
    const execution = await createExecution(zapId, workflow.userId, triggerPayload);
    const runId = execution.$id;

    const results: any[] = [];
    let success = true;

    // 3. Execute Actions sequentially
    for (const action of workflow.actions || []) {
      try {
        console.log(`   - Executing action: ${action.type} (${action.id})`);
        const result = await runAction(action.type, action.config || action.metadata, triggerPayload);
        results.push({ actionId: action.id, status: "success", result });
      } catch (error: any) {
        console.error(`   - Action failed: ${action.type}`, { error: error.message });
        results.push({ actionId: action.id, status: "failed", error: error.message });
        success = false;
        break; // Stop execution on first failure
      }
    }

    // 4. Update Final Status
    await updateExecutionStatus(
      runId,
      success ? "completed" : "failed"
    );

    console.log(`✅ Zap ${zapId} finished with status: ${success ? "SUCCESS" : "FAILED"}`);
    return { runId, success };
  } catch (error: any) {
    console.error(`❌ Execution error: ${error.message}`);
    throw error;
  }
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
      console.warn(`Unsupported action type: ${type}, simulating success.`);
      return { simulated: true, type };
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
 * Integration: Email (Resend placeholder)
 */
async function sendEmail(to: string, subject: string, body: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
     console.warn("Resend API Key missing. Skipping email send but marking as success for demo.");
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
