// AI Workflow Builder - Generate workflows from natural language
// This service will use AI to convert user descriptions into workflow configurations

export interface AIWorkflowRequest {
  description: string;
  userId: string;
}

export interface AIWorkflowResponse {
  name: string;
  description: string;
  trigger: {
    type: string;
    config: Record<string, unknown>;
  };
  actions: Array<{
    type: string;
    config: Record<string, unknown>;
  }>;
  matchedTemplate?: string;
}

/**
 * Generate workflow from natural language description
 * In production, this would call OpenAI/Anthropic API
 * For now, we use pattern matching to demonstrate the concept
 */
export async function generateWorkflowFromDescription(
  request: AIWorkflowRequest
): Promise<AIWorkflowResponse> {
  const { description } = request;
  const lowerDesc = description.toLowerCase();
  const hasAny = (keywords: string[]) => keywords.some((k) => lowerDesc.includes(k));

  // Pattern matching for demo (replace with actual AI in production)
  
  // Email notification patterns
  if (lowerDesc.includes('email') && (lowerDesc.includes('notify') || lowerDesc.includes('send'))) {
    if (lowerDesc.includes('lead') || lowerDesc.includes('form')) {
      return {
        name: 'Lead Notification Workflow',
        description: 'Send email notifications when new leads are captured',
        trigger: {
          type: 'webhook',
          config: { path: 'new-lead', expectedFields: ['name', 'email', 'company'] },
        },
        actions: [
          {
            type: 'email',
            config: {
              subject: '🎯 New Lead: {{name}}',
              to: 'team@company.com',
              body: 'New lead captured:\nName: {{name}}\nEmail: {{email}}\nCompany: {{company}}',
            },
          },
        ],
        matchedTemplate: 'New Lead Notification',
      };
    }
  }

  // Slack notification patterns
  if (lowerDesc.includes('slack') && (lowerDesc.includes('message') || lowerDesc.includes('notify'))) {
    if (lowerDesc.includes('sale') || lowerDesc.includes('payment')) {
      return {
        name: 'Sales Notification to Slack',
        description: 'Post to Slack when a sale is made',
        trigger: {
          type: 'webhook',
          config: { path: 'sale-made', expectedFields: ['amount', 'customer', 'product'] },
        },
        actions: [
          {
            type: 'slack',
            config: {
              channel: '#sales',
              text: '💰 New Sale! Amount: ${{amount}} | Customer: {{customer}} | Product: {{product}}',
            },
          },
        ],
        matchedTemplate: 'Website Form to Slack',
      };
    }
    
    return {
      name: 'General Slack Notification',
      description: 'Send notifications to Slack channel',
      trigger: {
        type: 'webhook',
        config: { path: 'notification', expectedFields: ['message', 'type'] },
      },
      actions: [
        {
          type: 'slack',
          config: {
            channel: '#notifications',
            text: '📢 {{message}}',
          },
        },
      ],
      matchedTemplate: 'Website Form to Slack',
    };
  }

  // Google Sheets patterns
  if (lowerDesc.includes('sheet') || lowerDesc.includes('spreadsheet') || lowerDesc.includes('excel')) {
    if (lowerDesc.includes('save') || lowerDesc.includes('store') || lowerDesc.includes('record')) {
      return {
        name: 'Save Data to Google Sheets',
        description: 'Automatically save data to a Google Sheet',
        trigger: {
          type: 'webhook',
          config: { path: 'data-submit', expectedFields: ['data'] },
        },
        actions: [
          {
            type: 'google-sheets',
            config: {
              spreadsheetId: 'your-spreadsheet-id',
              worksheetName: 'Responses',
              values: ['{{timestamp}}', '{{data}}'],
            },
          },
        ],
        matchedTemplate: 'Save Form Data to Google Sheets',
      };
    }
  }

  // Discord patterns
  if (lowerDesc.includes('discord') && (lowerDesc.includes('message') || lowerDesc.includes('post'))) {
    if (lowerDesc.includes('welcome') || lowerDesc.includes('new member') || lowerDesc.includes('join')) {
      return {
        name: 'Discord Welcome Message',
        description: 'Send welcome message to Discord when new member joins',
        trigger: {
          type: 'webhook',
          config: { path: 'member-join', expectedFields: ['name', 'email'] },
        },
        actions: [
          {
            type: 'discord',
            config: {
              webhookUrl: 'your-discord-webhook',
              content: '🎉 Welcome {{name}} to the community!',
              embeds: [
                {
                  title: 'New Member Joined',
                  description: 'Say hello to {{name}}!',
                  color: 5865222,
                  fields: [{ name: 'Email', value: '{{email}}' }],
                },
              ],
            },
          },
        ],
        matchedTemplate: 'New User Welcome Discord',
      };
    }
  }

  // Notion patterns
  if (lowerDesc.includes('notion') && (lowerDesc.includes('create') || lowerDesc.includes('add'))) {
    if (lowerDesc.includes('task') || lowerDesc.includes('todo')) {
      return {
        name: 'Create Notion Task',
        description: 'Create a new task in Notion database',
        trigger: {
          type: 'webhook',
          config: { path: 'task-created', expectedFields: ['title', 'assignee', 'priority'] },
        },
        actions: [
          {
            type: 'notion',
            config: {
              databaseId: 'your-database-id',
              title: '{{title}}',
              properties: {
                Status: 'To Do',
                Priority: '{{priority}}',
                Assignee: '{{assignee}}',
              },
            },
          },
        ],
        matchedTemplate: 'Add Tasks to Notion',
      };
    }
  }

  // SMS patterns
  if (lowerDesc.includes('sms') || lowerDesc.includes('text message')) {
    if (lowerDesc.includes('alert') || lowerDesc.includes('urgent') || lowerDesc.includes('critical')) {
      return {
        name: 'Critical SMS Alert',
        description: 'Send SMS alert for critical events',
        trigger: {
          type: 'webhook',
          config: { path: 'critical-event', expectedFields: ['message', 'severity'] },
        },
        actions: [
          {
            type: 'sms',
            config: {
              to: '+1234567890',
              body: '🚨 ALERT: {{message}}\nSeverity: {{severity}}',
            },
          },
        ],
        matchedTemplate: 'Critical Alert SMS',
      };
    }
  }

  // AI-first uncommon workflow templates
  if (hasAny(['meeting transcript', 'meeting notes', 'sop', 'standard operating procedure'])) {
    return {
      name: 'Meeting Notes to SOP Draft',
      description: 'Convert meeting transcript text into an SOP draft and share it with the operations team',
      trigger: {
        type: 'webhook',
        config: { path: 'meeting-transcript', expectedFields: ['transcript', 'meetingTitle', 'date'] },
      },
      actions: [
        {
          type: 'openai',
          config: {
            prompt: 'Convert transcript into SOP with scope, owners, steps, risks, and checklist:\n\n{{transcript}}',
          },
        },
        {
          type: 'slack',
          config: {
            channel: '#ops',
            text: 'SOP draft ready for {{meetingTitle}}:\n{{aiOutput}}',
          },
        },
      ],
      matchedTemplate: 'Meeting Notes to SOP Draft',
    };
  }

  if (hasAny(['invoice anomaly', 'suspicious invoice', 'invoice fraud', 'invoice check'])) {
    return {
      name: 'Invoice Anomaly Watchdog',
      description: 'Flag unusual invoice values for finance review',
      trigger: {
        type: 'webhook',
        config: { path: 'invoice-submitted', expectedFields: ['invoiceId', 'vendor', 'amount', 'historicalAverage'] },
      },
      actions: [
        {
          type: 'condition',
          config: {
            condition: '{{amount}} > {{historicalAverage}} * 1.8',
          },
        },
        {
          type: 'slack',
          config: {
            channel: '#finance-alerts',
            text: 'Possible anomaly detected on invoice {{invoiceId}} for vendor {{vendor}} (${{amount}})',
          },
        },
      ],
      matchedTemplate: 'Invoice Anomaly Watchdog',
    };
  }

  if (hasAny(['contract', 'clause risk', 'legal review'])) {
    return {
      name: 'Contract Clause Risk Checker',
      description: 'Analyze uploaded contracts and summarize risky clauses',
      trigger: {
        type: 'webhook',
        config: { path: 'contract-upload', expectedFields: ['contractName', 'contractText'] },
      },
      actions: [
        {
          type: 'openai',
          config: {
            prompt: 'Find risky legal clauses, assign risk score, and explain why:\n\n{{contractText}}',
          },
        },
        {
          type: 'email',
          config: {
            to: 'legal@company.com',
            subject: 'Contract Risk Summary: {{contractName}}',
            body: '{{aiOutput}}',
          },
        },
      ],
      matchedTemplate: 'Contract Clause Risk Checker',
    };
  }

  if (hasAny(['support escalation', 'ticket escalation', 'angry customer ticket', 'priority ticket'])) {
    return {
      name: 'Support Escalation Predictor',
      description: 'Predict support escalations and route high-risk tickets quickly',
      trigger: {
        type: 'webhook',
        config: { path: 'ticket-created', expectedFields: ['ticketId', 'ticketText', 'customerTier'] },
      },
      actions: [
        {
          type: 'openai',
          config: {
            prompt: 'Classify escalation risk as low/medium/high and explain:\n\n{{ticketText}}',
          },
        },
        {
          type: 'slack',
          config: {
            channel: '#support-priority',
            text: 'Ticket {{ticketId}} predicted risk: {{riskLevel}}\n{{aiOutput}}',
          },
        },
      ],
      matchedTemplate: 'Support Escalation Predictor',
    };
  }

  if (hasAny(['churn', 'customer risk', 'at-risk customer', 'retention alert'])) {
    return {
      name: 'Customer Churn Early Warning',
      description: 'Score churn risk and send daily digest to customer success',
      trigger: {
        type: 'schedule',
        config: { cron: '0 9 * * *', expectedFields: ['customerMetrics'] },
      },
      actions: [
        {
          type: 'openai',
          config: {
            prompt: 'Rank customers by churn risk and provide actionable reasons:\n\n{{customerMetrics}}',
          },
        },
        {
          type: 'email',
          config: {
            to: 'cs@company.com',
            subject: 'Daily Churn Early Warning',
            body: '{{aiOutput}}',
          },
        },
      ],
      matchedTemplate: 'Customer Churn Early Warning',
    };
  }

  if (hasAny(['sales call', 'objection', 'call transcript', 'rebuttal'])) {
    return {
      name: 'Sales Call Objection Miner',
      description: 'Extract common objections and create coaching notes for reps',
      trigger: {
        type: 'webhook',
        config: { path: 'sales-call-transcript', expectedFields: ['transcript', 'repName', 'date'] },
      },
      actions: [
        {
          type: 'openai',
          config: {
            prompt: 'Extract top objections, frequency, and rebuttal suggestions:\n\n{{transcript}}',
          },
        },
        {
          type: 'notion',
          config: {
            databaseId: 'your-database-id',
            title: 'Call Objections - {{repName}} - {{date}}',
            properties: {
              Summary: '{{aiOutput}}',
            },
          },
        },
      ],
      matchedTemplate: 'Sales Call Objection Miner',
    };
  }

  if (hasAny(['release notes', 'commits', 'changelog', 'release summary'])) {
    return {
      name: 'Release Notes from Commits',
      description: 'Generate structured release notes from engineering payloads',
      trigger: {
        type: 'webhook',
        config: { path: 'release-ready', expectedFields: ['releasePayload'] },
      },
      actions: [
        {
          type: 'openai',
          config: {
            prompt: 'Write release notes with sections: features, fixes, and breaking changes:\n\n{{releasePayload}}',
          },
        },
        {
          type: 'slack',
          config: {
            channel: '#product-updates',
            text: '{{aiOutput}}',
          },
        },
      ],
      matchedTemplate: 'Release Notes from Commits',
    };
  }

  if (hasAny(['competitor', 'market monitor', 'pricing change', 'competitor change'])) {
    return {
      name: 'Competitor Change Radar',
      description: 'Track competitor website changes and share strategic summaries',
      trigger: {
        type: 'schedule',
        config: { cron: '0 7 * * *', expectedFields: ['pageDiffs'] },
      },
      actions: [
        {
          type: 'openai',
          config: {
            prompt: 'Summarize meaningful competitor changes and likely impact:\n\n{{pageDiffs}}',
          },
        },
        {
          type: 'email',
          config: {
            to: 'strategy@company.com',
            subject: 'Competitor Radar Update',
            body: '{{aiOutput}}',
          },
        },
      ],
      matchedTemplate: 'Competitor Change Radar',
    };
  }

  if (hasAny(['policy drift', 'compliance drift', 'policy monitor'])) {
    return {
      name: 'Internal Policy Drift Monitor',
      description: 'Detect policy changes that drift from approved baselines',
      trigger: {
        type: 'schedule',
        config: { cron: '0 10 * * 1', expectedFields: ['currentPolicy', 'baselinePolicy'] },
      },
      actions: [
        {
          type: 'openai',
          config: {
            prompt: 'Compare current and baseline policy. Highlight material drift:\n\nCurrent: {{currentPolicy}}\nBaseline: {{baselinePolicy}}',
          },
        },
        {
          type: 'slack',
          config: {
            channel: '#compliance',
            text: '{{aiOutput}}',
          },
        },
      ],
      matchedTemplate: 'Internal Policy Drift Monitor',
    };
  }

  if (hasAny(['resume screening', 'candidate score', 'hiring rubric', 'resume scorer'])) {
    return {
      name: 'Resume Rubric Scorer',
      description: 'Score resumes against hiring rubric and send shortlist summaries',
      trigger: {
        type: 'webhook',
        config: { path: 'resume-submitted', expectedFields: ['candidateName', 'resumeText', 'rubric'] },
      },
      actions: [
        {
          type: 'openai',
          config: {
            prompt: 'Score candidate fit from 1-10 with strengths and concerns:\n\n{{resumeText}}\n\nRubric: {{rubric}}',
          },
        },
        {
          type: 'email',
          config: {
            to: 'hiring@company.com',
            subject: 'Candidate Scorecard: {{candidateName}}',
            body: '{{aiOutput}}',
          },
        },
      ],
      matchedTemplate: 'Resume Rubric Scorer',
    };
  }

  // Social media patterns
  if (lowerDesc.includes('tweet') || lowerDesc.includes('twitter') || lowerDesc.includes('post')) {
    return {
      name: 'Auto Post to Twitter',
      description: 'Automatically post to Twitter',
      trigger: {
        type: 'webhook',
        config: { path: 'content-ready', expectedFields: ['content', 'title'] },
      },
      actions: [
        {
          type: 'twitter',
          config: {
            status: '{{title}}\n\n{{content}}',
          },
        },
      ],
      matchedTemplate: 'Auto Post to Twitter',
    };
  }

  // Calendar patterns
  if (lowerDesc.includes('calendar') || lowerDesc.includes('meeting') || lowerDesc.includes('schedule')) {
    return {
      name: 'Schedule Calendar Event',
      description: 'Create calendar event from booking',
      trigger: {
        type: 'webhook',
        config: { path: 'booking-made', expectedFields: ['name', 'email', 'time', 'purpose'] },
      },
      actions: [
        {
          type: 'google-calendar',
          config: {
            summary: 'Meeting with {{name}}',
            description: '{{purpose}}',
            start: '{{time}}',
            end: '{{endTime}}',
            attendees: ['{{email}}'],
          },
        },
      ],
      matchedTemplate: 'Schedule Meeting from Form',
    };
  }

  // E-commerce patterns
  if (lowerDesc.includes('order') || lowerDesc.includes('purchase') || lowerDesc.includes('sale')) {
    if (lowerDesc.includes('confirm') || lowerDesc.includes('email')) {
      return {
        name: 'Order Confirmation Workflow',
        description: 'Send order confirmation email to customer',
        trigger: {
          type: 'webhook',
          config: { path: 'order-placed', expectedFields: ['orderId', 'customer', 'email', 'total', 'items'] },
        },
        actions: [
          {
            type: 'email',
            config: {
              subject: 'Order Confirmed #{{orderId}}',
              to: '{{email}}',
              body: 'Thank you for your order!\n\nOrder #{{orderId}}\nTotal: ${{total}}\nItems: {{items}}',
            },
          },
        ],
        matchedTemplate: 'New Lead Notification',
      };
    }
  }

  // Multi-step workflow patterns
  if (lowerDesc.includes('multiple') || lowerDesc.includes('several') || lowerDesc.includes('and also')) {
    return {
      name: 'Multi-Step Notification Workflow',
      description: 'Send notifications across multiple channels',
      trigger: {
        type: 'webhook',
        config: { path: 'important-event', expectedFields: ['message', 'type', 'priority'] },
      },
      actions: [
        {
          type: 'slack',
          config: {
            channel: '#notifications',
            text: '📢 {{message}}',
          },
        },
        {
          type: 'email',
          config: {
            subject: 'Important: {{message}}',
            to: 'team@company.com',
            body: 'Event notification:\n{{message}}\nPriority: {{priority}}',
          },
        },
        {
          type: 'google-sheets',
          config: {
            spreadsheetId: 'your-spreadsheet-id',
            worksheetName: 'Events',
            values: ['{{timestamp}}', '{{type}}', '{{message}}', '{{priority}}'],
          },
        },
      ],
      matchedTemplate: 'Complete Order Fulfillment',
    };
  }

  // Default fallback - create a generic workflow
  return {
    name: 'Custom Workflow',
    description: `Workflow created from: "${description}"`,
    trigger: {
      type: 'webhook',
      config: { path: 'custom-trigger', expectedFields: ['data'] },
    },
    actions: [
      {
        type: 'email',
        config: {
          subject: 'Workflow Triggered',
          to: 'admin@company.com',
          body: 'Workflow was triggered!\n\nData: {{data}}',
        },
      },
    ],
    matchedTemplate: undefined,
  };
}

/**
 * Suggest improvements for a workflow
 */
export function suggestWorkflowImprovements(workflow: AIWorkflowResponse): string[] {
  const suggestions: string[] = [];

  // Check for missing error handling
  if (!workflow.actions.some((a) => a.type === 'condition')) {
    suggestions.push('Consider adding conditional logic to handle different scenarios');
  }

  // Check for logging
  if (!workflow.actions.some((a) => a.type === 'webhook' || a.type === 'google-sheets')) {
    suggestions.push('Add a logging action to track workflow executions');
  }

  // Check for notifications on failure
  suggestions.push('Set up email alerts for workflow failures in the workflow settings');

  return suggestions;
}

/**
 * Extract variables from workflow configuration
 */
export function extractWorkflowVariables(workflow: AIWorkflowResponse): string[] {
  const variables = new Set<string>();
  const variableRegex = /\{\{([^}]+)\}\}/g;

  // Extract from trigger config
  if (workflow.trigger?.config) {
    const triggerStr = JSON.stringify(workflow.trigger.config);
    let match;
    while ((match = variableRegex.exec(triggerStr)) !== null) {
      variables.add(match[1].trim());
    }
  }

  // Extract from actions config
  workflow.actions?.forEach((action) => {
    if (action.config) {
      const actionStr = JSON.stringify(action.config);
      let match;
      while ((match = variableRegex.exec(actionStr)) !== null) {
        variables.add(match[1].trim());
      }
    }
  });

  return Array.from(variables);
}
