import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { appwriteDB, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';

/**
 * GET /api/executions
 * Get execution logs for user's workflows
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workflowId, status, limit = '50', page = '1' } = Object.fromEntries(
      request.nextUrl.searchParams
    );

    // Build query filters
    const queries: any[] = [Query.equal('userId', userId)];
    
    if (workflowId) {
      queries.push(Query.equal('workflowId', workflowId));
    }
    
    if (status) {
      queries.push(Query.equal('status', status));
    }

    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const offset = (pageNum - 1) * limitNum;

    // Get executions from Appwrite
    const executions = await appwriteDB.listDocuments(
      DATABASE_ID,
      COLLECTIONS.EXECUTIONS,
      [...queries, Query.limit(limitNum), Query.offset(offset)]
    );
    
    // Get execution logs for each execution
    const executionData = await Promise.all(
      executions.documents.map(async (exec) => {
        const logs = await appwriteDB.listDocuments(
          DATABASE_ID,
          COLLECTIONS.EXECUTION_LOGS,
          [Query.equal('executionId', exec.$id)]
        ).catch(() => ({ documents: [] }));
        
        return {
          ...exec,
          logs: logs.documents
        };
      })
    );

    const formattedExecutions = executionData.map((exec: any) => ({
      id: exec.$id,
      workflowId: exec.workflowId,
      status: exec.status,
      startedAt: exec.startedAt,
      completedAt: exec.completedAt,
      errorMessage: exec.errorMessage,
      logs: exec.logs
    }));

    return NextResponse.json({
      executions: formattedExecutions,
      pagination: {
        total: executions.total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(executions.total / limitNum),
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
