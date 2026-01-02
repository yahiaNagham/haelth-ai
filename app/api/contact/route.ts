// /api/contact/route.ts
import { NextResponse } from "next/server";
import { db } from "../../../lib/db"; // أو "@/lib/db" حسب المسار الصحيح

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "كل الحقول مطلوبة" }, { status: 400 });
    }

    const savedMessage = await db.message.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await db.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages); // ✅ يرجع مصفوفة مباشرة
  } catch (error) {
    return NextResponse.json({ error: "خطأ في جلب الرسائل" }, { status: 500 });
  }
}
