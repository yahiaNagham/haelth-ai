import { NextResponse } from "next/server";
import {prisma} from "../../../../lib/db"; // عدل المسار اذا لازم

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: parseInt(userId),
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
