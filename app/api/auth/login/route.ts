import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "79976cc57897488d41d80c4c7506af928c6be3ab8a92d069ce180237eb016ed7"; // Fallback strictly for local dev if missing
    
    const inputHash = crypto.createHash("sha256").update(password).digest("hex");

    if (inputHash === adminPasswordHash) {
      const token = await signToken({ authenticated: true });

      const response = NextResponse.json({ success: true }, { status: 200 });

      response.cookies.set({
        name: "admin_session",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}
