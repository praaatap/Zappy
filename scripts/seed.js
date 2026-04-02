#!/usr/bin/env node
/**
 * Database Seed Script
 * Creates initial templates and sample data for Zappy
 */

const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Database connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://zappy:zappy_password@localhost:5432/zappy';

const client = postgres(DATABASE_URL);
const db = drizzle(client);

// Sample templates data
const templates = [
  {
    name: 'Webhook to Email Notification',
    description: 'Send an email notification when a webhook is triggered',
    triggerType: 'webhook',
    triggerConfig: {
      method: 'POST',
      headers: {}
    },
    actions: [
      {
        id: 'action-1',
        type: 'email',
        config: {
          to: '{{webhook.email}}',
          subject: 'New Webhook Received',
          body: 'You received a new webhook: {{webhook.message}}'
        },
        order: 0
      }
    ]
  },
  {
    name: 'GitHub Star to Slack',
    description: 'Post to Slack when your GitHub repo receives a star',
    triggerType: 'github',
    triggerConfig: {
      event: 'star',
      repo: 'username/repo'
    },
    actions: [
      {
        id: 'action-1',
        type: 'slack',
        config: {
          channel: '#notifications',
          message: '🌟 New star on GitHub! {{github.username}} starred {{github.repo}}'
        },
        order: 0
      }
    ]
  },
  {
    name: 'Schedule Daily Report',
    description: 'Send a daily report email every morning',
    triggerType: 'schedule',
    triggerConfig: {
      cron: '0 9 * * *', // Every day at 9 AM
      timezone: 'UTC'
    },
    actions: [
      {
        id: 'action-1',
        type: 'email',
        config: {
          to: 'user@example.com',
          subject: 'Daily Report',
          body: 'Here is your daily report for {{date}}'
        },
        order: 0
      }
    ]
  },
  {
    name: 'Form Submission to Database',
    description: 'Save form submissions to your database',
    triggerType: 'webhook',
    triggerConfig: {
      method: 'POST',
      path: '/form-submit'
    },
    actions: [
      {
        id: 'action-1',
        type: 'database',
        config: {
          table: 'submissions',
          fields: {
            name: '{{webhook.name}}',
            email: '{{webhook.email}}',
            message: '{{webhook.message}}'
          }
        },
        order: 0
      },
      {
        id: 'action-2',
        type: 'email',
        config: {
          to: '{{webhook.email}}',
          subject: 'Thank you for your submission',
          body: 'We have received your submission, {{webhook.name}}!'
        },
        order: 1
      }
    ]
  }
];

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Create demo user
    console.log('Creating demo user...');
    const hashedPassword = await bcryptjs.hash('demo123', 10);
    
    const [demoUser] = await db.insert(users).values({
      name: 'Demo User',
      email: 'demo@zappy.com',
      password: hashedPassword,
      subscriptionPlan: 'pro',
      workflowsCount: 0,
      executionsThisMonth: 0
    }).returning();

    console.log(`✅ Created demo user: ${demoUser.email}`);

    // Create templates
    console.log('Creating workflow templates...');
    
    for (const template of templates) {
      const templateId = uuidv4();
      
      await db.insert(workflows).values({
        id: templateId,
        userId: demoUser.id,
        name: template.name,
        description: template.description,
        status: 'active',
        triggerType: template.triggerType,
        triggerConfig: template.triggerConfig,
        actions: template.actions,
        isTemplate: true,
        executionCount: 0
      });

      console.log(`  ✅ Created template: ${template.name}`);
    }

    console.log('\n✨ Database seed completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('   Email: demo@zappy.com');
    console.log('   Password: demo123');
    console.log('\n⚠️  Remember to change the demo user password in production!\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Import schema
const schemaPath = process.env.SCHEMA_PATH || './backend/src/data/schema';
let users, workflows, executionLogs, integrations;

try {
  const schema = require(schemaPath);
  users = schema.users;
  workflows = schema.workflows;
  executionLogs = schema.executionLogs;
  integrations = schema.integrations;
} catch (error) {
  console.error('Failed to load schema. Make sure to run this from the project root.');
  process.exit(1);
}

// Run seed
seed();
