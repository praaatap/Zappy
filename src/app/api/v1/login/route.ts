import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

/**
 * Login endpoint - DEPRECATED
 * Use Clerk authentication instead.
 * This endpoint is kept for backwards compatibility only.
 */
export async function POST(req: Request) {
    try {
        return NextResponse.json({
            error: "Legacy JWT authentication is deprecated. Please use Clerk OAuth instead.",
            redirectTo: "/sign-in"
        }, { status: 410 });
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}