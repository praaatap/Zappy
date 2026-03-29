// Workflow Templates - 15+ Pre-built Automation Templates

export interface TemplateConfig {
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  trigger: {
    type: string;
    name: string;
    config: Record<string, unknown>;
  };
  actions: Array<{
    type: string;
    name: string;
    config: Record<string, unknown>;
  }>;
}

export const workflowTemplates: TemplateConfig[] = [
  // 1. Email Notifications
  {
    name: 'New Lead Notification',
    description: 'Send an email when a new lead is captured via webhook',
    category: 'Email',
    icon: 'Mail',
    color: '#EA4335',
    trigger: {
      type: 'webhook',
      name: 'New Lead Captured',
      config: { path: 'new-lead' },
    },
    actions: [
      {
        type: 'email',
        name: 'Send Email Notification',
        config: {
          subject: '🎯 New Lead: {{name}}',
          to: 'sales@company.com',
          body: 'New lead captured:\nName: {{name}}\nEmail: {{email}}\nCompany: {{company}}',
        },
      },
    ],
  },

  // 2. Slack Notifications
  {
    name: 'Website Form to Slack',
    description: 'Post to Slack channel when someone submits your website form',
    category: 'Slack',
    icon: 'Hash',
    color: '#4A154B',
    trigger: {
      type: 'webhook',
      name: 'Form Submission',
      config: { path: 'form-submit' },
    },
    actions: [
      {
        type: 'slack',
        name: 'Post to Slack Channel',
        config: {
          channel: '#leads',
          text: '📩 New form submission from {{name}}\nEmail: {{email}}\nMessage: {{message}}',
        },
      },
    ],
  },

  // 3. Google Sheets Logger
  {
    name: 'Save Form Data to Google Sheets',
    description: 'Automatically save form submissions to a Google Sheet',
    category: 'Google Sheets',
    icon: 'Sheet',
    color: '#0F9D58',
    trigger: {
      type: 'webhook',
      name: 'Form Submission',
      config: { path: 'form-data' },
    },
    actions: [
      {
        type: 'google-sheets',
        name: 'Add Row to Sheet',
        config: {
          spreadsheetId: 'your-spreadsheet-id',
          worksheetName: 'Form Submissions',
          values: ['{{name}}', '{{email}}', '{{timestamp}}'],
        },
      },
    ],
  },

  // 4. Discord Notifications
  {
    name: 'New User Welcome Discord',
    description: 'Send a welcome message to Discord when a new user signs up',
    category: 'Discord',
    icon: 'MessageSquare',
    color: '#5865F2',
    trigger: {
      type: 'webhook',
      name: 'New User Signup',
      config: { path: 'user-signup' },
    },
    actions: [
      {
        type: 'discord',
        name: 'Send Discord Message',
        config: {
          webhookUrl: 'your-discord-webhook',
          content: '🎉 Welcome {{name}} to the community!',
          embeds: [
            {
              title: 'New Member',
              description: '{{name}} just joined!',
              color: 5865222,
              fields: [
                { name: 'Email', value: '{{email}}' },
                { name: 'Plan', value: '{{plan}}' },
              ],
            },
          ],
        },
      },
    ],
  },

  // 5. Notion Database Creator
  {
    name: 'Add Tasks to Notion',
    description: 'Create a new Notion page when a task is assigned',
    category: 'Notion',
    icon: 'Book',
    color: '#000000',
    trigger: {
      type: 'webhook',
      name: 'Task Created',
      config: { path: 'task-created' },
    },
    actions: [
      {
        type: 'notion',
        name: 'Create Notion Page',
        config: {
          databaseId: 'your-database-id',
          title: '{{taskName}}',
          properties: {
            Status: 'To Do',
            Priority: '{{priority}}',
            Assignee: '{{assignee}}',
          },
        },
      },
    ],
  },

  // 6. SMS Alerts
  {
    name: 'Critical Alert SMS',
    description: 'Send SMS for critical system alerts',
    category: 'SMS',
    icon: 'Smartphone',
    color: '#34C759',
    trigger: {
      type: 'webhook',
      name: 'Critical Alert',
      config: { path: 'critical-alert' },
    },
    actions: [
      {
        type: 'sms',
        name: 'Send SMS Alert',
        config: {
          to: '+1234567890',
          body: '🚨 CRITICAL ALERT: {{alertMessage}}\nTime: {{timestamp}}\nSeverity: {{severity}}',
        },
      },
    ],
  },

  // 7. Social Media Poster
  {
    name: 'Auto Post to Twitter',
    description: 'Automatically tweet when new blog post is published',
    category: 'Social Media',
    icon: 'Twitter',
    color: '#1DA1F2',
    trigger: {
      type: 'webhook',
      name: 'Blog Post Published',
      config: { path: 'blog-published' },
    },
    actions: [
      {
        type: 'twitter',
        name: 'Post Tweet',
        config: {
          status: '📝 New Blog Post: {{title}}\n\n{{excerpt}}\n\nRead more: {{url}}',
        },
      },
    ],
  },

  // 8. Calendar Event Creator
  {
    name: 'Schedule Meeting from Form',
    description: 'Create Google Calendar event when meeting is requested',
    category: 'Calendar',
    icon: 'Calendar',
    color: '#4285F4',
    trigger: {
      type: 'webhook',
      name: 'Meeting Request',
      config: { path: 'meeting-request' },
    },
    actions: [
      {
        type: 'google-calendar',
        name: 'Create Calendar Event',
        config: {
          summary: 'Meeting with {{name}}',
          description: '{{message}}',
          start: '{{meetingTime}}',
          end: '{{endTime}}',
          attendees: ['{{email}}'],
        },
      },
    ],
  },

  // 9. Trello Card Creator
  {
    name: 'Create Trello Card from Email',
    description: 'Add new Trello card when support email received',
    category: 'Trello',
    icon: 'Columns',
    color: '#0079BF',
    trigger: {
      type: 'webhook',
      name: 'Support Email Received',
      config: { path: 'support-email' },
    },
    actions: [
      {
        type: 'trello',
        name: 'Create Trello Card',
        config: {
          boardId: 'your-board-id',
          listId: 'your-list-id',
          name: 'Support: {{subject}}',
          description: 'From: {{from}}\n\n{{body}}',
          labels: ['support', 'urgent'],
        },
      },
    ],
  },

  // 10. GitHub Issue Creator
  {
    name: 'Create GitHub Issue from Form',
    description: 'Automatically create GitHub issue from bug report form',
    category: 'GitHub',
    icon: 'Github',
    color: '#181717',
    trigger: {
      type: 'webhook',
      name: 'Bug Report Submitted',
      config: { path: 'bug-report' },
    },
    actions: [
      {
        type: 'github',
        name: 'Create GitHub Issue',
        config: {
          owner: 'your-username',
          repo: 'your-repo',
          title: 'Bug: {{bugTitle}}',
          body: '## Description\n{{description}}\n\n## Steps to Reproduce\n{{steps}}\n\n## Reporter: {{email}}',
          labels: ['bug', 'triage'],
        },
      },
    ],
  },

  // 11. Airtable Record Creator
  {
    name: 'Add Customer to Airtable CRM',
    description: 'Add new customer details to Airtable CRM base',
    category: 'Airtable',
    icon: 'Database',
    color: '#FCB400',
    trigger: {
      type: 'webhook',
      name: 'New Customer',
      config: { path: 'new-customer' },
    },
    actions: [
      {
        type: 'airtable',
        name: 'Create Airtable Record',
        config: {
          baseId: 'your-base-id',
          table: 'Customers',
          fields: {
            Name: '{{name}}',
            Email: '{{email}}',
            Company: '{{company}}',
            Status: 'New Lead',
          },
        },
      },
    ],
  },

  // 12. WhatsApp Business Message
  {
    name: 'Order Confirmation WhatsApp',
    description: 'Send WhatsApp message for order confirmations',
    category: 'WhatsApp',
    icon: 'MessageCircle',
    color: '#25D366',
    trigger: {
      type: 'webhook',
      name: 'Order Placed',
      config: { path: 'order-placed' },
    },
    actions: [
      {
        type: 'whatsapp',
        name: 'Send WhatsApp Message',
        config: {
          to: '{{phoneNumber}}',
          body: '✅ Order Confirmed!\n\nOrder #{{orderId}}\nTotal: ${{total}}\n\nThank you for your purchase!',
        },
      },
    ],
  },

  // 13. Stripe Payment Tracker
  {
    name: 'Track Stripe Payments in Sheet',
    description: 'Log all Stripe payments to Google Sheets',
    category: 'Finance',
    icon: 'DollarSign',
    color: '#635BFF',
    trigger: {
      type: 'webhook',
      name: 'Payment Successful',
      config: { path: 'stripe-payment' },
    },
    actions: [
      {
        type: 'google-sheets',
        name: 'Log Payment to Sheet',
        config: {
          spreadsheetId: 'your-spreadsheet-id',
          worksheetName: 'Payments',
          values: ['{{chargeId}}', '{{amount}}', '{{customer}}', '{{timestamp}}'],
        },
      },
    ],
  },

  // 14. Zoom Meeting Scheduler
  {
    name: 'Create Zoom Meeting from Booking',
    description: 'Automatically create Zoom meeting when call is booked',
    category: 'Video',
    icon: 'Video',
    color: '#2D8CFF',
    trigger: {
      type: 'webhook',
      name: 'Call Booked',
      config: { path: 'call-booked' },
    },
    actions: [
      {
        type: 'zoom',
        name: 'Create Zoom Meeting',
        config: {
          topic: 'Call with {{name}}',
          start_time: '{{meetingTime}}',
          duration: 30,
          agenda: '{{purpose}}',
        },
      },
      {
        type: 'email',
        name: 'Send Meeting Link',
        config: {
          subject: 'Your Zoom Meeting Link',
          to: '{{email}}',
          body: 'Hi {{name}},\n\nHere is your Zoom meeting link: {{meetingUrl}}\n\nSee you soon!',
        },
      },
    ],
  },

  // 15. RSS to Social Media
  {
    name: 'Auto-post RSS to LinkedIn',
    description: 'Share new RSS feed items to LinkedIn automatically',
    category: 'Social Media',
    icon: 'Rss',
    color: '#0A66C2',
    trigger: {
      type: 'schedule',
      name: 'Check RSS Every Hour',
      config: { cron: '0 * * * *', rssUrl: 'https://example.com/rss' },
    },
    actions: [
      {
        type: 'linkedin',
        name: 'Post to LinkedIn',
        config: {
          content: '📰 {{title}}\n\n{{summary}}\n\n{{link}}',
        },
      },
    ],
  },

  // 16. Weather Alert System
  {
    name: 'Weather Alert Notifications',
    description: 'Get notified about severe weather conditions',
    category: 'Utilities',
    icon: 'Cloud',
    color: '#FF9800',
    trigger: {
      type: 'schedule',
      name: 'Check Weather Daily',
      config: { cron: '0 8 * * *', location: 'New York' },
    },
    actions: [
      {
        type: 'condition',
        name: 'Check Weather Severity',
        config: {
          condition: '{{temperature}} > 35 || {{temperature}} < 0',
        },
      },
      {
        type: 'sms',
        name: 'Send Weather Alert',
        config: {
          to: '+1234567890',
          body: '⚠️ Weather Alert: Extreme temperature {{temperature}}°C in {{location}}',
        },
      },
    ],
  },

  // 17. E-commerce Order Processor
  {
    name: 'Complete Order Fulfillment',
    description: 'Process order through multiple steps automatically',
    category: 'E-commerce',
    icon: 'ShoppingCart',
    color: '#FF6B6B',
    trigger: {
      type: 'webhook',
      name: 'New Order Received',
      config: { path: 'new-order' },
    },
    actions: [
      {
        type: 'google-sheets',
        name: 'Log Order to Sheet',
        config: {
          spreadsheetId: 'your-spreadsheet-id',
          worksheetName: 'Orders',
          values: ['{{orderId}}', '{{customer}}', '{{items}}', '{{total}}', '{{status}}'],
        },
      },
      {
        type: 'email',
        name: 'Send Order Confirmation',
        config: {
          subject: 'Order Confirmed #{{orderId}}',
          to: '{{customerEmail}}',
          body: 'Thank you for your order!\n\nOrder #{{orderId}}\nTotal: ${{total}}\n\nWe will ship soon!',
        },
      },
      {
        type: 'slack',
        name: 'Notify Warehouse Team',
        config: {
          channel: '#orders',
          text: '📦 New Order #{{orderId}} - {{items}} items - Ship to: {{address}}',
        },
      },
    ],
  },

  // 18. Meeting Transcript to SOP
  {
    name: 'Meeting Notes to SOP Draft',
    description: 'Turn meeting transcript text into a clean SOP draft and send to Slack',
    category: 'AI Workflows',
    icon: 'FileText',
    color: '#2563EB',
    trigger: {
      type: 'webhook',
      name: 'Meeting Transcript Received',
      config: { path: 'meeting-transcript' },
    },
    actions: [
      {
        type: 'openai',
        name: 'Generate SOP Draft',
        config: {
          prompt: 'Convert transcript into SOP with steps, owners, risks, and checklist:\n\n{{transcript}}',
        },
      },
      {
        type: 'slack',
        name: 'Send SOP Draft',
        config: {
          channel: '#ops',
          text: 'New SOP draft from meeting:\n\n{{aiOutput}}',
        },
      },
    ],
  },

  // 19. Invoice Anomaly Watchdog
  {
    name: 'Invoice Anomaly Watchdog',
    description: 'Detect unusual invoice totals and flag finance team for review',
    category: 'Finance',
    icon: 'ShieldAlert',
    color: '#DC2626',
    trigger: {
      type: 'webhook',
      name: 'Invoice Submitted',
      config: { path: 'invoice-submitted' },
    },
    actions: [
      {
        type: 'condition',
        name: 'Check Amount Spike',
        config: {
          condition: '{{amount}} > {{historicalAverage}} * 1.8',
        },
      },
      {
        type: 'slack',
        name: 'Alert Finance Channel',
        config: {
          channel: '#finance-alerts',
          text: 'Possible invoice anomaly for {{vendor}}. Amount: ${{amount}}',
        },
      },
    ],
  },

  // 20. Contract Clause Risk Checker
  {
    name: 'Contract Clause Risk Checker',
    description: 'Scan new contracts for risky clauses and notify legal team',
    category: 'Compliance',
    icon: 'FileSearch',
    color: '#7C3AED',
    trigger: {
      type: 'webhook',
      name: 'Contract Uploaded',
      config: { path: 'contract-upload' },
    },
    actions: [
      {
        type: 'openai',
        name: 'Analyze Risk Clauses',
        config: {
          prompt: 'Find risky clauses and produce risk score with reasons:\n\n{{contractText}}',
        },
      },
      {
        type: 'email',
        name: 'Send Legal Summary',
        config: {
          to: 'legal@company.com',
          subject: 'Contract Risk Summary: {{contractName}}',
          body: '{{aiOutput}}',
        },
      },
    ],
  },

  // 21. Support Escalation Predictor
  {
    name: 'Support Escalation Predictor',
    description: 'Classify new tickets that may escalate and notify team leads',
    category: 'AI Workflows',
    icon: 'LifeBuoy',
    color: '#F97316',
    trigger: {
      type: 'webhook',
      name: 'Ticket Created',
      config: { path: 'ticket-created' },
    },
    actions: [
      {
        type: 'openai',
        name: 'Predict Escalation Risk',
        config: {
          prompt: 'Classify ticket escalation risk (low/medium/high) and explain:\n\n{{ticketText}}',
        },
      },
      {
        type: 'slack',
        name: 'Notify Support Lead',
        config: {
          channel: '#support-priority',
          text: 'Ticket {{ticketId}} risk: {{riskLevel}}\n{{aiOutput}}',
        },
      },
    ],
  },

  // 22. Churn Early Warning Digest
  {
    name: 'Customer Churn Early Warning',
    description: 'Score customer churn risk daily and send a digest to CS team',
    category: 'Operations',
    icon: 'TrendingDown',
    color: '#B91C1C',
    trigger: {
      type: 'schedule',
      name: 'Daily Churn Scan',
      config: { cron: '0 9 * * *' },
    },
    actions: [
      {
        type: 'openai',
        name: 'Score Churn Risk',
        config: {
          prompt: 'Rank customers by churn risk from this data and explain top reasons:\n\n{{customerMetrics}}',
        },
      },
      {
        type: 'email',
        name: 'Send Churn Digest',
        config: {
          to: 'cs@company.com',
          subject: 'Daily Churn Early Warning',
          body: '{{aiOutput}}',
        },
      },
    ],
  },

  // 23. Sales Call Objection Miner
  {
    name: 'Sales Call Objection Miner',
    description: 'Extract recurring objections from call transcripts and post coaching notes',
    category: 'AI Workflows',
    icon: 'PhoneCall',
    color: '#0EA5E9',
    trigger: {
      type: 'webhook',
      name: 'Call Transcript Ready',
      config: { path: 'sales-call-transcript' },
    },
    actions: [
      {
        type: 'openai',
        name: 'Extract Objections',
        config: {
          prompt: 'Extract top objections, frequency, and suggested rebuttals:\n\n{{transcript}}',
        },
      },
      {
        type: 'notion',
        name: 'Save Coaching Notes',
        config: {
          databaseId: 'your-database-id',
          title: 'Call Objections - {{repName}} - {{date}}',
          properties: {
            Team: '{{team}}',
            Summary: '{{aiOutput}}',
          },
        },
      },
    ],
  },

  // 24. Release Notes Generator
  {
    name: 'Release Notes from Commits',
    description: 'Generate human-readable release notes from commit and ticket payloads',
    category: 'Productivity',
    icon: 'GitCommit',
    color: '#1D4ED8',
    trigger: {
      type: 'webhook',
      name: 'Release Build Ready',
      config: { path: 'release-ready' },
    },
    actions: [
      {
        type: 'openai',
        name: 'Draft Release Notes',
        config: {
          prompt: 'Create release notes grouped by features, fixes, and breaking changes:\n\n{{releasePayload}}',
        },
      },
      {
        type: 'slack',
        name: 'Share in Product Channel',
        config: {
          channel: '#product-updates',
          text: '{{aiOutput}}',
        },
      },
    ],
  },

  // 25. Competitor Change Radar
  {
    name: 'Competitor Change Radar',
    description: 'Monitor competitor pages and summarize meaningful product/pricing changes',
    category: 'Operations',
    icon: 'Radar',
    color: '#0891B2',
    trigger: {
      type: 'schedule',
      name: 'Daily Competitor Scan',
      config: { cron: '0 7 * * *' },
    },
    actions: [
      {
        type: 'http',
        name: 'Fetch Competitor Pages',
        config: {
          urls: ['{{competitorUrl1}}', '{{competitorUrl2}}'],
        },
      },
      {
        type: 'openai',
        name: 'Summarize Changes',
        config: {
          prompt: 'Compare with previous snapshots and summarize high-signal changes:\n\n{{pageDiffs}}',
        },
      },
      {
        type: 'email',
        name: 'Send Radar Digest',
        config: {
          to: 'strategy@company.com',
          subject: 'Competitor Radar Update',
          body: '{{aiOutput}}',
        },
      },
    ],
  },

  // 26. Policy Drift Monitor
  {
    name: 'Internal Policy Drift Monitor',
    description: 'Track policy document changes and alert when language drifts from baseline',
    category: 'Compliance',
    icon: 'ShieldCheck',
    color: '#059669',
    trigger: {
      type: 'schedule',
      name: 'Weekly Policy Check',
      config: { cron: '0 10 * * 1' },
    },
    actions: [
      {
        type: 'openai',
        name: 'Compare Against Baseline',
        config: {
          prompt: 'Identify policy drift and list material changes:\n\nCurrent: {{currentPolicy}}\nBaseline: {{baselinePolicy}}',
        },
      },
      {
        type: 'slack',
        name: 'Notify Compliance Team',
        config: {
          channel: '#compliance',
          text: 'Policy drift report:\n{{aiOutput}}',
        },
      },
    ],
  },

  // 27. Resume Rubric Scorer
  {
    name: 'Resume Rubric Scorer',
    description: 'Score resumes against role rubric and send shortlists to hiring managers',
    category: 'HR',
    icon: 'Users',
    color: '#7C2D12',
    trigger: {
      type: 'webhook',
      name: 'Resume Submitted',
      config: { path: 'resume-submitted' },
    },
    actions: [
      {
        type: 'openai',
        name: 'Score Candidate Fit',
        config: {
          prompt: 'Score this resume against role rubric and provide top strengths and risks:\n\n{{resumeText}}\n\nRubric: {{rubric}}',
        },
      },
      {
        type: 'email',
        name: 'Send Hiring Summary',
        config: {
          to: 'hiring@company.com',
          subject: 'Candidate Scorecard: {{candidateName}}',
          body: '{{aiOutput}}',
        },
      },
    ],
  },
];

// Categories for filtering
export const templateCategories = [
  'All',
  'Email',
  'Slack',
  'Google Sheets',
  'Discord',
  'Notion',
  'SMS',
  'Social Media',
  'Calendar',
  'Trello',
  'GitHub',
  'Airtable',
  'WhatsApp',
  'Finance',
  'Video',
  'Utilities',
  'E-commerce',
  'AI Workflows',
  'Operations',
  'Compliance',
  'HR',
  'Productivity',
];
