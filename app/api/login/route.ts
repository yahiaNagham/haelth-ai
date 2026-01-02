import bcrypt from "bcrypt";
import db from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { RowDataPacket } from "mysql2";


export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // التحقق من Admin أولاً
    const [adminRows] = await db.execute<RowDataPacket[]>(
      "SELECT ID_A, Firstname, Lastname, Email, Password FROM admin WHERE Email = ?",
      [normalizedEmail]
    );

    if (adminRows.length > 0) {
      const admin = adminRows[0];

      if (!admin.Password) {
        return NextResponse.json({ success: false, message: "Authentication error" }, { status: 500 });
      }

      const passwordMatch = await bcrypt.compare(password.trim(), admin.Password);

      if (!passwordMatch) {
        return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
      }

      // تخزين بيانات الجلسة في الكوكيز
      const cookie = serialize("user", JSON.stringify({ email, type: "admin", id: admin.ID_A }), {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24,  // الجلسة ستكون صالحة لمدة يوم
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
      });

      return NextResponse.json({ success: true, redirect: "/admin/dashboard" }, { headers: { "Set-Cookie": cookie } });
    }

    // التحقق من Patient
    const [patientRows] = await db.execute<RowDataPacket[]>(
      "SELECT ID_P, Firstname, Lastname, Email, Password FROM patient WHERE Email = ?",
      [normalizedEmail]
    );

    if (patientRows.length > 0) {
      const patient = patientRows[0];

      if (!patient.Password) {
        return NextResponse.json({ success: false, message: "Authentication error" }, { status: 500 });
      }

      const passwordMatch = await bcrypt.compare(password.trim(), patient.Password);

      if (!passwordMatch) {
        return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
      }

      // تخزين بيانات الجلسة في الكوكيز للمريض
      const cookie = serialize("user", JSON.stringify({ email, type: "patient", id: patient.ID_P,patientId: patient.ID_P ,}), {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24,  // الجلسة ستكون صالحة لمدة يوم
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
      });

      return NextResponse.json({ success: true, redirect: "/" }, { headers: { "Set-Cookie": cookie } });
    }

    return NextResponse.json({ success: false, message: "Email not found" }, { status: 404 });

  } catch (error: unknown) {
    console.error("Login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
