import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET() {
  try {
    // 1. نجيب كل المواعيد المؤكدة
    const appointments = await db.appointment.findMany({
      where: { status: 'Confirmed' },
    });

    // 2. نجيب كل الـ medical tests
    const medicalTests = await db.medicalTest.findMany();

    // 3. ندمج المعلومات يدويًا
    const merged = appointments.map(app => {
      const test = medicalTests.find(mt => mt.appointmentId === app.id);
      return {
        ...app,
        testStatus: test?.status ?? 'Pending',
        resultFile: test?.resultFile ?? null
      };
    });

    return NextResponse.json(merged);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}
