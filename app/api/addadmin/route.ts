import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import db from "../../../lib/db";
import { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
    try {
        console.log("🔹 Receiving request...");
        const body = await req.json();
        const { Firstname, Lastname, Email, Password } = body;

        console.log("📩 Request Data:", { Firstname, Lastname, Email });

        if (!Firstname || !Lastname || !Email || !Password) {
            console.warn("⚠️ Missing required fields!");
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        console.log("🔹 Connecting to database...");
        const connection = await mysql.createConnection(db);
        console.log("✅ Connected successfully!");

        console.log("🔹 Checking if email exists...");
        const [existingAdmins] = await connection.execute<RowDataPacket[]>(
            "SELECT ID_A FROM admin WHERE Email = ?", 
            [Email]
        );
        console.log("✅ Email check done!");

        if (existingAdmins.length > 0) {
            console.warn("⚠️ Email already exists!");
            await connection.end();
            return NextResponse.json({ message: "Email already exists" }, { status: 409 });
        }

        console.log("🔹 Hashing password...");
        const hashedPassword = await bcrypt.hash(Password, 10);
        console.log("✅ Password hashed!");

        console.log("🔹 Inserting admin...");
        await connection.execute(
            "INSERT INTO admin (Firstname, Lastname, Email, Password) VALUES (?, ?, ?, ?)",
            [Firstname, Lastname, Email, hashedPassword]
        );
        console.log("✅ Admin inserted!");

        await connection.end();
        return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });

    } catch (error) {
        console.error("🔥 Database Error:", error);
        return NextResponse.json(
            { message: "Error creating admin", error: (error as Error).message },
            { status: 500 }
        );
    }
}
