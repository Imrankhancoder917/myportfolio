import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Simple in-memory rate limiting (works for a single instance / serverless function instance)
// For a robust production solution, you would use Redis or Vercel KV.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000 * 5; // 5 minutes
const MAX_REQUESTS_PER_WINDOW = 3;

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") || "unknown_ip";
    const now = Date.now();
    const rateLimitRecord = rateLimitMap.get(ip);
    
    if (rateLimitRecord) {
      if (now - rateLimitRecord.timestamp < RATE_LIMIT_WINDOW_MS) {
        if (rateLimitRecord.count >= MAX_REQUESTS_PER_WINDOW) {
          return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
          );
        }
        rateLimitRecord.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    // 2. Parse and Validate Request
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // 3. Ensure Environment Variables are Set
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.error("Email configuration missing: EMAIL_USER or EMAIL_PASS is not set.");
      return NextResponse.json(
        { error: "Server configuration error. Cannot send email at this time." },
        { status: 500 }
      );
    }

    // 4. Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });

    // 5. Send Email to Owner
    const userAgent = request.headers.get("user-agent") || "Unknown User Agent";
    
    await transporter.sendMail({
      from: `"${name}" <${user}>`, // Use authenticated user as sender to avoid DMARC issues
      replyTo: email,
      to: "ik3370349@gmail.com",
      subject: `New Portfolio Message: ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0;">New Contact Form Submission</h2>
          <p style="color: #475569; font-size: 14px;">You have received a new message from your portfolio website.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 120px;"><strong>Name:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">
                <a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Subject:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;"><strong>Timestamp:</strong></td>
              <td style="padding: 8px 0; color: #0f172a;">${new Date().toUTCString()}</td>
            </tr>
          </table>

          <h3 style="color: #0f172a; margin-top: 24px; margin-bottom: 12px;">Message:</h3>
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; color: #334155; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">
            ${message}
          </div>

          <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">
            Sent from User-Agent: ${userAgent}<br />
            IP: ${ip}
          </p>
        </div>
      `,
    });

    // 6. Send Auto-Confirmation to Sender (Optional but requested)
    try {
      await transporter.sendMail({
        from: `"Imran Khan" <${user}>`,
        to: email,
        subject: "Thank you for reaching out!",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f172a; margin-top: 0;">Thanks for your message, ${name}!</h2>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">
              This is an automatic confirmation that I have received your message regarding <strong>"${subject}"</strong>.
            </p>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">
              I'll review it and get back to you as soon as possible.
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 14px; color: #64748b;">
              Best regards,<br/>
              <strong>Imran Khan</strong>
            </p>
          </div>
        `,
      });
    } catch (confError) {
      // Don't fail the whole request if the confirmation email fails
      console.error("Failed to send confirmation email:", confError);
    }

    // 7. Success Response
    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Log errors only on the server
    console.error("SMTP / Email Sending Error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
