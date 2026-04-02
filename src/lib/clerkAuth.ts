/**
 * Clerk Auth Helpers
 * Replaces local JWT auth with Clerk-managed sessions
 */

import { auth } from "@clerk/nextjs/server";
import { createOrUpdateUser } from "./appwrite";

/**
 * Get current authenticated user from Clerk
 * Syncs to Appwrite if needed
 */
export async function getCurrentUser() {
  const { userId, sessionId } = await auth();

  if (!userId || !sessionId) {
    return null;
  }

  // Return the Clerk user ID for Appwrite queries
  return {
    id: userId,
    clerkId: userId,
  };
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Sync Clerk user to Appwrite on first request
 */
export async function syncClerkUserToAppwrite(clerkUser: any) {
  try {
    if (!clerkUser) return;

    await createOrUpdateUser(
      clerkUser.id,
      clerkUser.primaryEmailAddress?.emailAddress || "",
      clerkUser.firstName + " " + clerkUser.lastName || "",
      clerkUser.imageUrl || undefined
    );
  } catch (error) {
    console.error("Error syncing Clerk user to Appwrite:", error);
    // Don't throw - allow the request to continue even if sync fails
  }
}
