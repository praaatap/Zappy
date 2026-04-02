import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { zaps, triggers, actions, users } from '@/db/schema';
import { generateWorkflowFromDescription } from '@/lib/aiWorkflowBuilder';
import { syncUser } from '@/lib/authSync';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/ai/build-workflow
 * Generate a workflow from natural language description
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await syncUser();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { description, createWorkflow } = await request.json();

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    // Generate workflow configuration using AI
    const workflowConfig = await generateWorkflowFromDescription({
      description,
      userId: userId,
    });

    // Optionally create the workflow immediately
    if (createWorkflow) {
      const zapId = uuidv4();
      const triggerId = uuidv4();

      await db.transaction(async (tx) => {
        // Create zap
        await tx.insert(zaps).values({
          id: zapId,
          userId,
          name: workflowConfig.name,
          description: workflowConfig.description,
          status: 'draft',
          triggerId: triggerId
        });

        // Create trigger
        await tx.insert(triggers).values({
          id: triggerId,
          zapId,
          type: workflowConfig.trigger.type,
          metadata: workflowConfig.trigger.config
        });

        // Create actions
        if (workflowConfig.actions && workflowConfig.actions.length > 0) {
          const actionRecords = workflowConfig.actions.map((action, index) => ({
            id: uuidv4(),
            zapId,
            type: action.type,
            metadata: action.config,
            sortingOrder: index
          }));
          
          await tx.insert(actions).values(actionRecords);
        }
      });

      // Get generated zap with relations
      const newZap = await db.query.zaps.findFirst({
        where: (z, { eq }) => eq(z.id, zapId),
        with: { trigger: true, actions: true }
      });

      return NextResponse.json({
        message: 'Workflow created successfully',
        workflow: newZap,
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
