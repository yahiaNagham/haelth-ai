import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db'; // استيراد Prisma Client
import bcrypt from 'bcrypt';

// التصدير المسمى للطريقة POST
export async function POST(req: NextRequest) {
  const { Firstname, Lastname, DateOfBirth, Email, Password, Gender } = await req.json();  // قراءة البيانات بتنسيق JSON

  // التحقق من صحة المدخلات
  if (!Firstname || !Lastname || !DateOfBirth || !Email || !Password || !Gender) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 }
    );
  }

  try {
    // تشفير كلمة المرور قبل التخزين
    const hashedPassword = await bcrypt.hash(Password, 10);

    // إدخال البيانات في قاعدة البيانات باستخدام Prisma
    const result = await prisma.patient.create({
      data: {
        firstname: Firstname, // تأكد من مطابقة الأسماء في الجدول
        lastname: Lastname,
        dateOfBirth: new Date(DateOfBirth), // تأكد من تحويل التاريخ إلى كائن Date
        email: Email,
        password: hashedPassword,
        gender: Gender,
      },
    });

    return NextResponse.json({ message: 'Patient added successfully', result });
  } catch (error) {
    console.error(error); // تسجيل الأخطاء في الخادم
    return NextResponse.json({ error: 'Error adding patient' }, { status: 500 });
  }
}
