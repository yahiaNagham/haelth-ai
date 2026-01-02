import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db"; // صحح المسار لو كان لازم

// ✅ GET: جلب موعد بالآي دي
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ PATCH: تعديل موعد
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    let completeTime: Date | null = null;

    if (body.time) {
      if (body.time.includes("T")) {
        // إذا كان الوقت جاي بصيغة ISO
        completeTime = new Date(body.time);
      } else {
        // إذا كان جاي hh:mm فقط
        const [hours, minutes] = body.time.split(":");
        completeTime = new Date();
        completeTime.setUTCHours(parseInt(hours));
        completeTime.setUTCMinutes(parseInt(minutes));
        completeTime.setUTCSeconds(0);
        completeTime.setUTCMilliseconds(0);
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: parseInt(id),
      },
      data: {
        familyFname: body.familyFname || null,
        familyLname: body.familyLname || null,
        email: body.email,
        phone: body.phone || null,
        date: body.date ? new Date(body.date) : null,
        time: completeTime,
        notes: body.notes || null,
        status: body.status || undefined,
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: "Server error", details: (error as Error).message }, { status: 500 });
  }
}

// ✅ DELETE: حذف موعد
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await prisma.appointment.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json({ error: "Server error", details: (error as Error).message }, { status: 500 });
  }
}
