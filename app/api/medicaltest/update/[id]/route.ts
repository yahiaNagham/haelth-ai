import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const appointmentId = parseInt(params.id);
  const formData = await req.formData();
  const testType = formData.get('testType')?.toString();
  const patientId = parseInt(formData.get('patientId')?.toString() || '');
  const file = formData.get('file') as File;

  if (!testType || !file || isNaN(appointmentId) || isNaN(patientId)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = path.join(process.cwd(), 'public', 'uploads', file.name);
  await writeFile(filePath, buffer);

  const resultFile = `/uploads/${file.name}`;

  // ✅ Update MedicalTest
  await prisma.medicalTest.updateMany({
    where: { appointmentId },
    data: {
      testType,
      resultFile,
    },
  });

  // ✅ Update Notification using patientId
  await prisma.notification.updateMany({
    where: {
      patientId,
      fileLink: {
        not: null, // Only for test results
      },
    },
    data: {
      message: `Test result updated: ${testType}`,
      fileLink: resultFile,
    },
  });

  return NextResponse.json({ success: true });
}
