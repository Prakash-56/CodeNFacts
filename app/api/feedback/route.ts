import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type FeedbackBody = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FeedbackBody;

    const { name, email, phone, subject, message } = body;

    // Server-side validation (all required)
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "All fields are required: name, email, phone, subject, message." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    // Env vars from .env.local
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,       // the Gmail that receives feedback + sends confirmation
      SMTP_PASS,       // App Password for that Gmail
      FEEDBACK_TO,     // optional override; defaults to SMTP_USER
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.error("Missing SMTP env vars. Check .env.local");
      return NextResponse.json(
        { error: "Email service is not configured. Please try again later." },
        { status: 500 }
      );
    }

    const adminEmail = FEEDBACK_TO || SMTP_USER;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for 465, false for 587
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // 1) Send feedback to admin Gmail
    await transporter.sendMail({
      from: `"Community Feedback" <${SMTP_USER}>`,
      to: adminEmail,
      replyTo: email,
      subject: `[Feedback] ${subject} — from ${name}`,
      text: `
New feedback received

Name:    ${name}
Email:   ${email}
Phone:   ${phone}
Subject: ${subject}

Message:
${message}

—
Sent from your Community platform
      `.trim(),
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="margin-bottom: 4px;">New Feedback</h2>
          <p style="color:#666; margin-top:0;">Someone submitted feedback on the platform.</p>
          <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding:8px 0; color:#666; width:100px;">Name</td>
              <td style="padding:8px 0; font-weight:600;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#666;">Email</td>
              <td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#666;">Phone</td>
              <td style="padding:8px 0;">${escapeHtml(phone)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#666;">Subject</td>
              <td style="padding:8px 0;">${escapeHtml(subject)}</td>
            </tr>
          </table>
          <div style="background:#f4f4f5; border-radius:8px; padding:16px; white-space:pre-wrap;">
            ${escapeHtml(message)}
          </div>
          <p style="color:#999; font-size:12px; margin-top:24px;">
            Reply directly to this email to respond to the user.
          </p>
        </div>
      `,
    });

    // 2) Instant thank-you email to the user
    await transporter.sendMail({
      from: `"Community Team" <${SMTP_USER}>`,
      to: email,
      subject: "Thanks for your feedback !!",
      text: `
Hi ${name},

Thank you for sharing your feedback with us. We've received your message and our team will review it shortly.

Your subject: ${subject}

Keep going up ..

— Community Team
      `.trim(),
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; line-height: 1.5;">
          <h2 style="margin-bottom: 8px;">Thanks for your feedback!</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>
            We've received your message and our team will review it shortly.
            Your input helps us build a better space for coders.
          </p>
          <p style="background:#f0fdf4; border-radius:8px; padding:12px 16px; color:#166534;">
            <strong>Keep coding, Keep creating ..❤️..</strong>
          </p>
          <p style="color:#666; font-size:14px;">
            Subject you sent: <em>${escapeHtml(subject)}</em>
          </p>
          <hr style="border:none; border-top:1px solid #eee; margin:24px 0;" />
          <p style="color:#999; font-size:12px;">
            This is an automated confirmation. You can reply to this email if you have more to share.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Feedback sent successfully." });
  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json(
      { error: "Failed to send feedback. Please try again later." },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}