import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { zapRuns, zaps } from '@/db/schema';
import { eq, inArray, desc, sql, and } from 'drizzle-orm';
import { syncUser } from '@/lib/authSync';

/**
 * GET /api/executions
 * Get execution logs for user's workflows
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await syncUser();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workflowId, status, limit = '50', page = '1' } = Object.fromEntries(
      request.nextUrl.searchParams
    );

    // Get user's workflows to ensure they own the zaps
    const userWorkflows = await db.query.zaps.findMany({
      where: eq(zaps.userId, userId),
      columns: { id: true }
    });
    
    if (userWorkflows.length === 0) {
      return NextResponse.json({
        executions: [],
        pagination: { total: 0, page: parseInt(page), limit: parseInt(limit), pages: 0 },
      });
    }

    const workflowIds = userWorkflows.map(w => w.id);

    // If workflowId is provided, check if user owns it
    if (workflowId && !workflowIds.includes(workflowId)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const targetZaps = workflowId ? [workflowId] : workflowIds;

    // Pagination
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    conditions.push(inArray(zapRuns.zapId, targetZaps));
    if (status) {
        conditions.push(eq(zapRuns.status, status));
    }

    // Get executions
    const executionsResult = await db.query.zapRuns.findMany({
      where: and(...conditions),
      orderBy: [desc(zapRuns.startedAt)],
      limit: limitNum,
      offset: offset,
      with: {
        zap: {
          columns: { name: true }
        }
      }
    });

    const formattedExecutions = executionsResult.map(run => ({
      _id: run.id,
      workflowId: run.zapId,
      workflowName: run.zap?.name,
      status: run.status,
      startedAt: run.startedAt,
      completedAt: run.completedAt,
      metadata: run.metadata
    }));

    // Get total count
    const [{ count }] = await db.select({ count: sql`count(*)`.mapWith(Number) })
      .from(zapRuns)
      .where(and(...conditions));

    return NextResponse.json({
      executions: formattedExecutions,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(count / limitNum),
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
