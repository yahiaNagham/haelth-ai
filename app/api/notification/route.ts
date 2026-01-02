

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const extractTime = (time: string) => {
  const date = new Date(time);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ notifications: [] });
  }

  const patientId = parseInt(userId);

  // 1. إشعارات المواعيد
  const appointments = await prisma.appointment.findMany({
    where: {
      patientId,
      OR: [
        { status: "Confirmed" },
        { status: "Cancelled" },
      ],
    },
    orderBy: { date: "desc" },
    select: {
      status: true,
      notes: true,
      date: true,
      time: true,
      familyFname: true,
      familyLname: true,
    },
  });

  const appointmentNotifications = appointments
    .map((app) => {
      if (!app.date || !app.time) return null;

      const formattedDate = new Date(app.date).toLocaleDateString('en-US');
      const formattedTime = extractTime(app.time);
      const fullName = `${app.familyFname} ${app.familyLname}`;

      if (app.status === "Confirmed") {
        return {
          type: "appointment",
          message: `✅ Your appointment with ${fullName} is confirmed on ${formattedDate} at ${formattedTime}${app.notes ? ` - Note: ${app.notes}` : " - Please attend the appointment"}`,
          createdAt: app.date,
        };
      } else if (app.status === "Cancelled") {
        return {
          type: "appointment",
          message: `❌ Your appointment with ${fullName} has been cancelled on ${formattedDate} at ${formattedTime}${app.notes ? ` - Reason: ${app.notes}` : ""}.`,
          createdAt: app.date,
        };
      }

      return null;
    })
    .filter(Boolean);

  // 2. إشعارات التحاليل الطبية
  const medicalNotifications = await prisma.notification.findMany({
    where: { patientId },
    select: {
      message: true,
      fileLink: true,
      createdAt: true,
      isRead: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedMedical = medicalNotifications.map((notif) => ({
    type: "medical",
    message: `🧪 ${notif.message}`,
    fileLink: notif.fileLink,
    createdAt: notif.createdAt,
    isRead: notif.isRead,
  }));

  // 3. دمج الكل
  const allNotifications = [...appointmentNotifications, ...formattedMedical].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({ notifications: allNotifications });
}





