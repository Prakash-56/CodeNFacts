// app/api/support/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, category, subject, message } = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const gmailUser = process.env.GMAIL_USER;
    // Strip ALL spaces — copy-pasting from Google often includes them
    const gmailPass = process.env.GMAIL_APP_PASS?.replace(/\s+/g, '');

    // Catch missing env vars early with a clear message
    if (!gmailUser || !gmailPass) {
      console.error('[Support] Missing env vars:', {
        hasUser: !!gmailUser,
        hasPass: !!gmailPass,
      });
      return NextResponse.json(
        { error: 'Server email configuration is missing.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    // Verify SMTP connection before sending — throws with a clear error if auth fails
    await transporter.verify();

    const ticketId = `SUP-${Math.floor(1000 + Math.random() * 9000)}`;

    // ── Email to YOU (support inbox) ──────────────────────────────────
    await transporter.sendMail({
      from: `"Support System" <${gmailUser}>`,
      to: gmailUser,
      replyTo: email,
      subject: `[${ticketId}] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f10;color:#e4e4e7;padding:32px;border-radius:12px;border:1px solid #27272a;">
          <h2 style="color:#3b82f6;margin-top:0;">New Support Ticket — ${ticketId}</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#a1a1aa;width:140px;">Name</td><td style="padding:8px 0;color:#f4f4f5;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#a1a1aa;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#60a5fa;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#a1a1aa;">Category</td><td style="padding:8px 0;color:#f4f4f5;">${category ?? 'General Inquiry'}</td></tr>
            <tr><td style="padding:8px 0;color:#a1a1aa;">Subject</td><td style="padding:8px 0;color:#f4f4f5;">${subject}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#18181b;border-radius:8px;border-left:3px solid #3b82f6;">
            <p style="color:#a1a1aa;margin:0 0 8px;">Message</p>
            <p style="color:#f4f4f5;margin:0;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="color:#52525b;font-size:12px;margin-top:24px;">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    });

    // ── Confirmation email to USER ────────────────────────────────────
    await transporter.sendMail({
      from: `"Support Team" <${gmailUser}>`,
      to: email,
      subject: `We received your request — ${ticketId}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f10;color:#e4e4e7;padding:32px;border-radius:12px;border:1px solid #27272a;">
          <h2 style="color:#3b82f6;margin-top:0;">We've got your message, ${name}!</h2>
          <p style="color:#a1a1aa;">Your support ticket has been created. We'll get back to you as soon as possible.</p>
          <div style="padding:16px;background:#18181b;border-radius:8px;margin:24px 0;text-align:center;">
            <p style="color:#52525b;margin:0 0 4px;font-size:13px;">Your Ticket ID</p>
            <p style="color:#3b82f6;font-size:24px;font-weight:bold;margin:0;letter-spacing:2px;">${ticketId}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:6px 0;color:#a1a1aa;width:120px;font-size:14px;">Category</td><td style="padding:6px 0;color:#f4f4f5;font-size:14px;">${category ?? 'General Inquiry'}</td></tr>
            <tr><td style="padding:6px 0;color:#a1a1aa;font-size:14px;">Subject</td><td style="padding:6px 0;color:#f4f4f5;font-size:14px;">${subject}</td></tr>
          </table>
          <p style="color:#52525b;font-size:13px;">If you have additional details to share, simply reply to this email.</p>
          <p style="color:#52525b;font-size:12px;margin-top:32px;border-top:1px solid #27272a;padding-top:16px;">This is an automated confirmation.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, ticketId }, { status: 200 });

  } catch (err: unknown) {
    // Log the REAL error to your terminal
    console.error('[Support Route Error]', err);

    const errorMessage = err instanceof Error ? err.message : String(err);

    if (errorMessage.includes('Invalid login') || errorMessage.includes('535')) {
      return NextResponse.json(
        { error: 'Gmail authentication failed. Check your App Password in .env.local.' },
        { status: 500 }
      );
    }

    if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Could not connect to Gmail SMTP. Check your internet/firewall.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: `Failed to send email: ${errorMessage}` },
      { status: 500 }
    );
  }
}