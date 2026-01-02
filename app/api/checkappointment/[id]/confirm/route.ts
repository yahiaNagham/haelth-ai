// app/api/checkappointment/[id]/confirm/route.ts

import { prisma } from '../../../../../lib/db';
import { NextResponse } from 'next/server';

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  const appointmentId = parseInt(params.id);

  if (isNaN(appointmentId)) {
    return NextResponse.json({ error: 'معرّف غير صالح' }, { status: 400 });
  }

  try {
    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'Confirmed' },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('فشل في تأكيد الموعد:', error);
    return NextResponse.json({ error: 'فشل في تأكيد الموعد' }, { status: 500 });
  }
}
