// Workflows API - CRUD operations for workflows

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Workflow, User } from '@/lib/models';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

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
 * GET /api/workflows
 * Get all workflows for the current user
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const workflows = await Workflow.find({ userId: user.userId }).sort({
      updatedAt: -1,
    });

    return NextResponse.json({ workflows });
  } catch (error: any) {
    console.error('Get workflows error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workflows
 * Create a new workflow
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

    const { name, description, trigger, actions, templateId } = await request.json();

    // Validate input
    if (!name || !trigger || !actions) {
      return NextResponse.json(
        { error: 'Name, trigger, and actions are required' },
        { status: 400 }
      );
    }

    // Generate webhook URL if trigger is webhook
    const webhookUrl =
      trigger.type === 'webhook'
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/trigger/[id]`
        : undefined;

    // Create workflow
    const workflow = await Workflow.create({
      userId: user.userId,
      name,
      description,
      status: 'draft',
      trigger: {
        type: trigger.type,
        config: trigger.config || {},
        webhookUrl,
      },
      actions: actions.map((action: any, index: number) => ({
        id: uuidv4(),
        type: action.type,
        config: action.config || {},
        order: index,
      })),
      templateId,
      isTemplate: false,
      executionCount: 0,
    });

    // Update user's workflow count
    await User.findByIdAndUpdate(user.userId, {
      $inc: { workflowsCount: 1 },
    });

    return NextResponse.json(
      {
        message: 'Workflow created successfully',
        workflow: {
          ...workflow.toObject(),
          id: workflow._id,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create workflow error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
