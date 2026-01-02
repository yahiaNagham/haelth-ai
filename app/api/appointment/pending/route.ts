import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pendingAppointments = await db.appointment.findMany({
      where: { status: "Pending" },
      select: {
        id: true,
        familyFname: true,
        familyLname: true,
        email: true, // تأكد من أنك تضيف هذا إذا كنت تريد الإيميل من نفس الجدول
      },
    });

    return NextResponse.json({
      count: pendingAppointments.length,
      notifications: pendingAppointments.map((notif: any) => ({
        ...notif,
        user: `${notif.family_fname} ${notif.family_lname}`,
        action: "قام بحجز موعد جديد",
        unread: true,
        avatar: "https://example.com/avatar.jpg", // استبدل بعنوان صورة البروفايل إذا لزم الأمر
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
