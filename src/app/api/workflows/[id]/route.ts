// Single Workflow API - Get, update, delete specific workflow

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Workflow, User } from '@/lib/models';
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
 * GET /api/workflows/[id]
 * Get a specific workflow
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const workflow = await Workflow.findOne({ _id: id, userId: user.userId });
    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ workflow });
  } catch (error: any) {
    console.error('Get workflow error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/workflows/[id]
 * Update a workflow
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, description, trigger, actions, status } = await request.json();

    const workflow = await Workflow.findOne({ _id: id, userId: user.userId });
    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (name) workflow.name = name;
    if (description !== undefined) workflow.description = description;
    if (trigger) {
      workflow.trigger = {
        type: trigger.type,
        config: trigger.config || {},
        webhookUrl:
          trigger.type === 'webhook'
            ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/trigger/${id}`
            : workflow.trigger.webhookUrl,
      };
    }
    if (actions) {
      workflow.actions = actions.map((action: any, index: number) => ({
        id: action.id || `action-${index}`,
        type: action.type,
        config: action.config || {},
        order: index,
      }));
    }
    if (status) {
      workflow.status = status;
    }

    await workflow.save();

    return NextResponse.json({
      message: 'Workflow updated successfully',
      workflow,
    });
  } catch (error: any) {
    console.error('Update workflow error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/workflows/[id]
 * Delete a workflow
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const workflow = await Workflow.findOneAndDelete({
      _id: id,
      userId: user.userId,
    });
    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Update user's workflow count
    await User.findByIdAndUpdate(user.userId, {
      $inc: { workflowsCount: -1 },
    });

    return NextResponse.json({
      message: 'Workflow deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete workflow error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
