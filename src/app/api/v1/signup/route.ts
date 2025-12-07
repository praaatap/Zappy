import { NextResponse } from "next/server";
import { db } from "@/db"; // This imports from src/db/index.ts
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const SECRET = "supersecret123"; // In a real app, use process.env.JWT_SECRET

export async function POST(req: Request) {
    const { name, email, password } = await req.json();

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (existingUser) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert User
    const [user] = await db.insert(users).values({
        name,
        email,
        password: hashedPassword
    }).returning();

    // Generate Token
    const token = jwt.sign({ id: user.id }, SECRET);

    return NextResponse.json({
        message: "User created",
        token,
        user: { name: user.name, email: user.email }
    });
}