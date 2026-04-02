#!/usr/bin/env node

/**
 * Zappy Appwrite Setup Script
 * 
 * This script initializes all required Appwrite collections and indexes
 * Run with: npx ts-node scripts/setup-appwrite.ts
 */

import { Client, Databases, ID } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
const apiKey = process.env.NEXT_PUBLIC_APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE || "default";

if (!projectId || !apiKey) {
  console.error("❌ Missing Appwrite credentials. Set in .env.local:");
  console.error("   NEXT_PUBLIC_APPWRITE_PROJECT");
  console.error("   NEXT_PUBLIC_APPWRITE_API_KEY");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

async function createCollections() {
  const collections = [
    {
      id: "workflows",
      name: "Workflows",
      attributes: [
        { id: "userId", name: "userId", type: "string", required: true },
        { id: "name", name: "name", type: "string", required: true },
        { id: "description", name: "description", type: "string", required: false },
        { id: "status", name: "status", type: "string", required: true, default: "draft" },
        { id: "trigger", name: "trigger", type: "json", required: false },
        { id: "actions", name: "actions", type: "json", required: false },
        { id: "createdAt", name: "createdAt", type: "datetime", required: false },
        { id: "updatedAt", name: "updatedAt", type: "datetime", required: false },
      ],
      indexes: [
        { id: "userId_idx", keys: ["userId"], type: "key" },
        { id: "status_idx", keys: ["status"], type: "key" },
      ],
    },
    {
      id: "executions",
      name: "Executions",
      attributes: [
        { id: "workflowId", name: "workflowId", type: "string", required: true },
        { id: "userId", name: "userId", type: "string", required: true },
        { id: "status", name: "status", type: "string", required: true },
        { id: "executionData", name: "executionData", type: "json", required: false },
        { id: "errorMessage", name: "errorMessage", type: "string", required: false },
        { id: "startedAt", name: "startedAt", type: "datetime", required: false },
        { id: "completedAt", name: "completedAt", type: "datetime", required: false },
      ],
      indexes: [
        { id: "workflowId_idx", keys: ["workflowId"], type: "key" },
        { id: "userId_idx", keys: ["userId"], type: "key" },
        { id: "status_idx", keys: ["status"], type: "key" },
      ],
    },
    {
      id: "execution_logs",
      name: "Execution Logs",
      attributes: [
        { id: "executionId", name: "executionId", type: "string", required: true },
        { id: "workflowId", name: "workflowId", type: "string", required: true },
        { id: "userId", name: "userId", type: "string", required: true },
        { id: "actionId", name: "actionId", type: "string", required: true },
        { id: "actionType", name: "actionType", type: "string", required: true },
        { id: "status", name: "status", type: "string", required: true },
        { id: "input", name: "input", type: "json", required: false },
        { id: "output", name: "output", type: "json", required: false },
        { id: "error", name: "error", type: "string", required: false },
        { id: "timestamp", name: "timestamp", type: "datetime", required: false },
      ],
      indexes: [
        { id: "executionId_idx", keys: ["executionId"], type: "key" },
        { id: "workflowId_idx", keys: ["workflowId"], type: "key" },
        { id: "userId_idx", keys: ["userId"], type: "key" },
      ],
    },
    {
      id: "integrations",
      name: "Integrations",
      attributes: [
        { id: "userId", name: "userId", type: "string", required: true },
        { id: "type", name: "type", type: "string", required: true },
        { id: "name", name: "name", type: "string", required: true },
        { id: "credentials", name: "credentials", type: "json", required: false },
        { id: "isActive", name: "isActive", type: "boolean", required: true, default: true },
        { id: "createdAt", name: "createdAt", type: "datetime", required: false },
      ],
      indexes: [
        { id: "userId_idx", keys: ["userId"], type: "key" },
        { id: "type_idx", keys: ["type"], type: "key" },
      ],
    },
    {
      id: "templates",
      name: "Templates",
      attributes: [
        { id: "name", name: "name", type: "string", required: true },
        { id: "description", name: "description", type: "string", required: false },
        { id: "category", name: "category", type: "string", required: false },
        { id: "trigger", name: "trigger", type: "json", required: true },
        { id: "actions", name: "actions", type: "json", required: true },
        { id: "preview", name: "preview", type: "json", required: false },
        { id: "createdAt", name: "createdAt", type: "datetime", required: false },
      ],
      indexes: [
        { id: "category_idx", keys: ["category"], type: "key" },
      ],
    },
  ];

  for (const collection of collections) {
    try {
      console.log(`📦 Creating collection: ${collection.name}...`);
      await databases.createCollection(databaseId, collection.id, collection.name);
      console.log(`   ✅ Collection created`);

      // Add attributes
      for (const attr of collection.attributes) {
        const attrType = attr.type;
        
        try {
          if (attrType === "string") {
            await databases.createStringAttribute(
              databaseId,
              collection.id,
              attr.id,
              attr.required || false,
              attr.default as string
            );
          } else if (attrType === "datetime") {
            await databases.createDatetimeAttribute(
              databaseId,
              collection.id,
              attr.id,
              attr.required || false
            );
          } else if (attrType === "json") {
            await databases.createPointAttribute(
              databaseId,
              collection.id,
              attr.id,
              attr.required || false
            );
          } else if (attrType === "boolean") {
            await databases.createBooleanAttribute(
              databaseId,
              collection.id,
              attr.id,
              attr.required || false,
              attr.default as boolean
            );
          }
          console.log(`   ✓ Attribute: ${attr.id}`);
        } catch (e: any) {
          if (e.code !== 409) {
            console.warn(`   ⚠ Attribute ${attr.id}:`, e.message);
          }
        }
      }

      // Add indexes
      for (const index of collection.indexes) {
        try {
          await databases.createIndex(
            databaseId,
            collection.id,
            index.id,
            "key",
            index.keys
          );
          console.log(`   ✓ Index: ${index.id}`);
        } catch (e: any) {
          if (e.code !== 409) {
            console.warn(`   ⚠ Index ${index.id}:`, e.message);
          }
        }
      }
    } catch (e: any) {
      if (e.code === 409) {
        console.log(`   ℹ Collection already exists, skipping`);
      } else {
        console.error(`   ❌ Error:`, e.message);
      }
    }
  }
}

async function main() {
  console.log("🚀 Zappy Appwrite Setup\n");
  console.log(`Endpoint:  ${endpoint}`);
  console.log(`Project:   ${projectId}`);
  console.log(`Database:  ${databaseId}\n`);

  try {
    await createCollections();
    console.log("\n✅ Setup complete! Your Appwrite database is ready.\n");
    console.log("Next steps:");
    console.log("  1. npm install");
    console.log("  2. npm run dev");
    console.log("  3. Visit http://localhost:3000");
    console.log("  4. Sign in with Clerk");
    console.log("  5. Create your first workflow!\n");
  } catch (e: any) {
    console.error("\n❌ Setup failed:", e.message);
    process.exit(1);
  }
}

main();
