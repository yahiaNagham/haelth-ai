// app/api/checkappointment/[id]/reject/route.ts
import { prisma } from '../../../../../lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { reason } = await req.json();
    const id = parseInt(params.id);

    await prisma.appointment.update({
      where: { id },
      data: {
        status: 'Cancelled',
        notes: reason,
      },
    });

    return NextResponse.json({ message: 'تم الرفض بنجاح' });
  } catch (error) {
    console.error('Error rejecting appointment:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء رفض الموعد' }, { status: 500 });
  }
}
