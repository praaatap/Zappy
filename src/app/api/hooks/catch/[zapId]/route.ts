import { NextResponse } from "next/server";
import { executeWorkflow } from "@/lib/workflow/engine";

/**
 * POST /api/hooks/catch/[zapId]
 * Webhook endpoint to trigger a Zap execution
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ zapId: string }> }
) {
  try {
    const { zapId } = await params;
    
    // Parse request body as trigger data
    let triggerData = {};
    try {
      triggerData = await req.json();
    } catch (e) {
      // If no JSON body, we'll just use an empty object
      console.warn("Webhook received with no JSON body");
    }

    // Execute the workflow
    console.log(`⚡ Webhook received for Zap ${zapId}. Triggering execution...`);
    
    const result = await executeWorkflow(zapId, triggerData);

    if (result.success) {
      return NextResponse.json({
        message: "Zap executed successfully",
        executionId: result.executionId,
      });
    } else {
      return NextResponse.json({
        message: "Zap execution failed",
        executionId: result.executionId,
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error in webhook catch:", error);
    return NextResponse.json({ 
      message: "Internal Server Error",
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * GET /api/hooks/catch/[zapId]
 * Just to confirm the endpoint is working
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ zapId: string }> }
) {
    const { zapId } = await params;
    return NextResponse.json({ 
        message: "Webhook endpoint is active",
        zapId,
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/hooks/catch/${zapId}`
    });
}
