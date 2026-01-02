import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { hash } from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
    }: {
      first_name: string;
      last_name: string;
      email: string;
      phone?: string | null;
      password: string;
      dateOfBirth?: string | null;
      gender?: "Male" | "Female" | null;
    } = await request.json();

    // Validate required fields
    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json(
        { user: null, message: "First name, last name, email, and password are required" },
        { status: 400 }
      );
    }

    // Verify email uniqueness
    const existingPatient = await db.patient.findUnique({
      where: { email: email },
    });
    if (existingPatient) {
      return NextResponse.json(
        { user: null, message: "Patient with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new patient
    const newPatient = await db.patient.create({
      data: {
        firstname: first_name,
        lastname: last_name,
        email: email,
        password: hashedPassword,
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || null,
        accountType: "Standard",
        address: null,
        location: null,
      },
    });

    // Exclude password from response
    const { password: _, ...rest } = newPatient;
    return NextResponse.json({
      user: rest,
      message: "Patient registered successfully",
    });
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: (error as Error).message },
      { status: 500 }
    );
  }
}