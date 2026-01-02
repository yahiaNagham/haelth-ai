import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '../../../../lib/db';

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID missing' }, { status: 400 });
  }

  try {
    await prisma.notification.updateMany({
      where: {
        patientId: parseInt(userId),
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ message: 'All notifications marked as read ✅' });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Failed to mark all as read' }, { status: 500 });
  }
}
