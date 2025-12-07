import { NextResponse } from "next/server";
import { db } from "@/db";
import { zapRuns, zaps } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: { zapId: string } }) {
    const body = await req.json();
    const zapId = (await params).zapId; // Await params in Next.js 15+

    // 1. Store the Run (Audit Log)
    await db.insert(zapRuns).values({
        id: uuidv4(),
        zapId: zapId,
        metadata: body,
        status: 0 // Started
    });

    // 2. Fetch the Zap Logic to execute
    const zap = await db.query.zaps.findFirst({
        where: eq(zaps.id, zapId),
        with: {
            actions: true
        }
    });

    if(!zap) return NextResponse.json({ message: "Zap not found" }, { status: 404 });

    // 3. EXECUTE THE LOGIC IMMEDIATELY
    console.log(`⚡ Processing Zap ${zapId}...`);
    
    try {
        for(const action of zap.actions) {
            // Simulate Email Sending
            if(action.actionId === "email") {
                console.log(`📧 Sending Email...`);
                // @ts-ignore
                console.log(`   To: ${action.metadata?.to}`);
                // @ts-ignore
                console.log(`   Subject: ${action.metadata?.subject}`);
                console.log(`   Body: Data received ${JSON.stringify(body)}`);
            }
            
            // Artificial delay to feel like "work" is happening
            await new Promise(r => setTimeout(r, 1000));
        }
        
        console.log("✅ Zap Finished Successfully");
        return NextResponse.json({ status: "success" });

    } catch(e) {
        console.log("❌ Zap Failed");
        return NextResponse.json({ status: "error" }, { status: 500 });
    }
}