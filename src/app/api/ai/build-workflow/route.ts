import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateWorkflowFromDescription } from '@/lib/aiWorkflowBuilder';
import { createWorkflow } from '@/lib/appwrite';

/**
 * POST /api/ai/build-workflow
 * Generate a workflow from natural language description
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { description, shouldCreate } = await request.json();

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    // Generate workflow configuration using AI
    const workflowConfig = await generateWorkflowFromDescription({
      description,
      userId: userId,
    });

    // Optionally create the workflow immediately
    if (shouldCreate) {
      const workflow = await createWorkflow(
        userId,
        workflowConfig.name || 'AI Generated Workflow',
        workflowConfig.trigger || { type: 'webhook', config: {} },
        workflowConfig.actions || []
      );

      return NextResponse.json({
        message: 'Workflow created successfully',
        workflow: workflow,
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
