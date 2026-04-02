import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Ensures the currently authenticated Clerk user is synced into the local PostgreSQL database.
 * Prevents Foreign Key constraint errors when creating records associated with the user.
 */
export async function syncUser() {
    const { userId } = await auth();
    if (!userId) return null;

    // Check if user exists
    const [existing] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (!existing) {
        // Fetch detailed info from Clerk Server API
        const user = await currentUser();
        if (!user) return null;

        const email = user.emailAddresses[0]?.emailAddress || `${userId}@placeholder.com`;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || "Zappy User";
        const imageUrl = user.imageUrl || "";

        try {
            await db.insert(users).values({
                id: userId,
                email,
                name,
                imageUrl,
            }).onConflictDoNothing(); // In case of race condition
        } catch (error) {
            console.error("Error syncing user to DB:", error);
        }
    }

    return userId;
}
