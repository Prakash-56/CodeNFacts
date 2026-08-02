import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// TODO(backend): confirm these env var names match the ones used in your
// existing email-verification route (GMAIL_USER / GMAIL_APP_PASSWORD, or
// whatever you named them there) so both features share one config.
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// TODO(backend): set this to the inbox that should receive contact form
// submissions — can be the same as GMAIL_USER or a separate support alias.
const CONTACT_RECEIVER = process.env.CONTACT_RECEIVER_EMAIL || GMAIL_USER;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// TODO(backend): swap for a real store (Redis/Firestore) if you need rate
// limiting to survive across serverless instances/restarts. This in-memory
// map only protects a single warm instance.
const submissionLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= RATE_LIMIT_MAX) {
    submissionLog.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  submissionLog.set(ip, timestamps);
  return false;
}

function getTransporter() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error("Email service is not configured.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages sent. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const subject = String(body?.subject || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 }
      );
    }

    if (!CONTACT_RECEIVER) {
      // Fails loudly in dev instead of silently dropping messages
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const transporter = getTransporter();

    // Notify the CodeNFacts team
    await transporter.sendMail({
      from: `"CodeNFacts Contact Form" <${GMAIL_USER}>`,
      to: CONTACT_RECEIVER,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
          <h2 style="color: #10b981;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    // Send the user a confirmation email
    // TODO(backend): tweak copy/branding, or skip this if you'd rather only notify the team
    await transporter.sendMail({
      from: `"CodeNFacts" <${GMAIL_USER}>`,
      to: email,
      subject: "We've received your message — CodeNFacts",
      text: `Hi ${name},\n\nThanks for reaching out to CodeNFacts. We've received your message and a mentor from our team will get back to you soon.\n\nYour message:\n"${message}"\n\n— The CodeNFacts Team`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
          <h2 style="color: #10b981;">Thanks for reaching out, ${escapeHtml(name)}!</h2>
          <p>We've received your message and a mentor from our team will get back to you soon.</p>
          <blockquote style="border-left: 3px solid #10b981; margin: 16px 0; padding-left: 12px; color: #555;">
            ${escapeHtml(message)}
          </blockquote>
          <p>— The CodeNFacts Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}