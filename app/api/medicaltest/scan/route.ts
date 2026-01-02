// File: app/api/medicaltest/scan/route.ts

import { writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../../../lib/db'; // Change if the file path is different

export async function POST(req: Request) {
  try {
    console.log("📥 Request received at /api/medicaltest/scan");
    const formData = await req.formData();

    const testType = formData.get('testType') as string;
    const appointmentId = parseInt(formData.get('appointmentId') as string);
    const patientId = parseInt(formData.get('patientId') as string);
    const file = formData.get('file') as File;

    if (!testType || !appointmentId || !patientId || !file) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '❌ Unsupported file type' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${uuidv4()}_${file.name}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

    await writeFile(filePath, buffer);

    await prisma.medicalTest.create({
      data: {
        testType,
        appointmentId,
        patientId,
        status: 'Sent',
        resultFile: `/uploads/${fileName}`,
      },
    });

    await prisma.notification.create({
      data: {
        patientId,
        message: `Test result uploaded: ${testType}`,
        fileLink: `/uploads/${fileName}`,
        isRead: false,
      },
    });

    return NextResponse.json({ message: 'Uploaded successfully ✅' });
  } catch (err) {
    console.error('Error in scan route:', err);
    return NextResponse.json({ error: 'Upload failed ❌' }, { status: 500 });
  }
}
