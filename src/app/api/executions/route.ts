// Execution Logs API - Get workflow execution history

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ExecutionLog, Workflow } from '@/lib/models';
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
 * GET /api/executions
 * Get execution logs for user's workflows
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

    const { workflowId, status, limit = '50', page = '1' } = Object.fromEntries(
      request.nextUrl.searchParams
    );

    // Get user's workflows
    const userWorkflows = await Workflow.find({ userId: user.userId }).select('_id');
    const workflowIds = userWorkflows.map((w: any) => w._id);

    // Build filter
    const filter: any = { workflowId: { $in: workflowIds } };
    if (workflowId) {
      filter.workflowId = workflowId;
    }
    if (status) {
      filter.status = status;
    }

    // Pagination
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    // Get executions
    const executions = await ExecutionLog.find(filter)
      .sort({ startedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('workflowId', 'name');

    // Get total count
    const total = await ExecutionLog.countDocuments(filter);

    return NextResponse.json({
      executions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get executions error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
