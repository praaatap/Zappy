// Webhook Trigger API - Receive external webhook events and trigger workflows

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Workflow } from '@/lib/models';
import { executeWorkflow } from '@/lib/workflowEngine';

/**
 * POST /api/webhooks/trigger/[workflowId]
 * Trigger a workflow with webhook data
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const { workflowId } = await params;
  
  try {
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Find the workflow
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Check if workflow is active
    if (workflow.status !== 'active') {
      return NextResponse.json(
        { error: 'Workflow is not active', status: workflow.status },
        { status: 400 }
      );
    }

    // Validate trigger type
    if (workflow.trigger.type !== 'webhook') {
      return NextResponse.json(
        { error: 'Workflow does not accept webhook triggers' },
        { status: 400 }
      );
    }

    // Execute the workflow
    const result = await executeWorkflow(workflowId, body);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Workflow triggered successfully',
        executionId: result.executionId,
        duration: result.duration,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Workflow execution failed',
        executionId: result.executionId,
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Webhook trigger error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/trigger/[workflowId]
 * Get webhook URL info for a workflow
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const { workflowId } = await params;
  
  try {
    await connectDB();

    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/trigger/${workflowId}`;

    return NextResponse.json({
      workflowId,
      webhookUrl,
      triggerType: workflow.trigger.type,
      expectedFields: workflow.trigger.config.expectedFields || [],
      status: workflow.status,
    });
  } catch (error: any) {
    console.error('Webhook info error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
