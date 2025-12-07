import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const SECRET = "supersecret123"; // In a real app, use process.env.JWT_SECRET

export async function POST(req: Request) {
    const { email, password } = await req.json();

    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 403 });
    }

    // Generate Token
    const token = jwt.sign({ id: user.id }, SECRET);

    return NextResponse.json({ token, user: { name: user.name, email: user.email } });
}