// AI Workflow Builder API - Generate workflows from natural language

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Workflow, User } from '@/lib/models';
import { generateWorkflowFromDescription } from '@/lib/aiWorkflowBuilder';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper to get user from token
async function getCurrentUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}

/**
 * POST /api/ai/build-workflow
 * Generate a workflow from natural language description
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { description, createWorkflow } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Generate workflow configuration using AI
    const workflowConfig = await generateWorkflowFromDescription({
      description,
      userId: user.userId,
    });

    // Optionally create the workflow immediately
    if (createWorkflow) {
      const workflow = await Workflow.create({
        userId: user.userId,
        name: workflowConfig.name,
        description: workflowConfig.description,
        status: 'draft',
        trigger: {
          type: workflowConfig.trigger.type,
          config: workflowConfig.trigger.config,
          webhookUrl:
            workflowConfig.trigger.type === 'webhook'
              ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/trigger/[id]`
              : undefined,
        },
        actions: workflowConfig.actions.map((action, index) => ({
          id: `action-${index}`,
          type: action.type,
          config: action.config,
          order: index,
        })),
        templateId: workflowConfig.matchedTemplate,
        isTemplate: false,
        executionCount: 0,
      });

      await User.findByIdAndUpdate(user.userId, {
        $inc: { workflowsCount: 1 },
      });

      return NextResponse.json({
        message: 'Workflow created successfully',
        workflow: {
          ...workflow.toObject(),
          id: workflow._id,
        },
        aiSuggestions: workflowConfig.matchedTemplate
          ? `Based on your description, we used the "${workflowConfig.matchedTemplate}" template`
          : 'Custom workflow created based on your description',
      });
    }

    // Just return the generated configuration
    return NextResponse.json({
      workflow: workflowConfig,
      message: 'Workflow generated successfully',
    });
  } catch (error: any) {
    console.error('AI workflow builder error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
