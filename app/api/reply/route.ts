// app/api/reply/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { messageId, response } = await req.json();

    if (!messageId || !response) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    const reply = await db.reply.create({
      data: {
        messageId,
        response,
      },
    });

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Error saving reply:", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
