// app/api/checkappointment/all/route.ts

import { prisma } from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب المواعيد' }, { status: 500 });
  }
}
