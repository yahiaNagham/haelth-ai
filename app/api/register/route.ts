import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const { Firstname, Lastname, DateOfBirth, Email, Password, Gender } = await req.json();

    console.log("Received Data:", { Firstname, Lastname, DateOfBirth, Email, Password, Gender });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [existingUser]: any = await db.execute("SELECT * FROM patient WHERE Email = ?", [Email]);

    if (existingUser.length > 0) {
      return NextResponse.json({ success: false, message: "This email is already in use. Please choose another one." }, { status: 400 });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(Password, 10);

    // إدخال المستخدم الجديد إلى قاعدة البيانات
    const [result] = await db.execute(
      "INSERT INTO patient (Firstname, Lastname, DateOfBirth, Email, Password, Gender) VALUES (?, ?, ?, ?, ?, ?)",
      [Firstname, Lastname, DateOfBirth, Email, hashedPassword, Gender]
    );

    console.log("DB Insert Result:", result);

    return NextResponse.json({ success: true, message: "Registration successful!" });
  } catch (error) {
    console.error("Registration error:", error);

    let errorMessage = "Registration failed";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
