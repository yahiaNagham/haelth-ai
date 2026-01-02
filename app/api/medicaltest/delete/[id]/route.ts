import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const appointmentId = parseInt(params.id);

  if (isNaN(appointmentId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  // Fetch data related to the appointment
  const test = await prisma.medicalTest.findFirst({
    where: { appointmentId },
  });

  if (!test) {
    return NextResponse.json({ error: 'Test result not found' }, { status: 404 });
  }

  const patientId = test.patientId;

  // Delete the test result
  await prisma.medicalTest.deleteMany({
    where: { appointmentId },
  });

  // Delete the notification related to the test using patientId
  await prisma.notification.deleteMany({
    where: {
      patientId,
      fileLink: {
        not: null,
      },
      message: {
        contains: test.testType, // Delete only the notification related to this specific test
      },
    },
  });

  return NextResponse.json({ success: true });
}
