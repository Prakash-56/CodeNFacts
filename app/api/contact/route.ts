// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, mobile, message } = await req.json();

    if (!name || !email || !mobile || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_PASS,
      },
    });

    const submittedAt = new Date().toUTCString();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Contact Form - ${name}</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- TOP ACCENT BAR -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,transparent,#3b82f6,transparent);border-radius:4px 4px 0 0;"></td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td style="background:#111113;border:1px solid #27272a;border-bottom:none;border-radius:16px 16px 0 0;padding:36px 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#71717a;font-weight:600;">
                      Inbound Message
                    </p>
                    <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.03em;font-family:Georgia,serif;">
                      Contact Form 💬
                    </h1>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:10px 16px;text-align:center;">
                      <p style="margin:0;font-size:10px;color:#52525b;text-transform:uppercase;letter-spacing:0.1em;">Source</p>
                      <p style="margin:4px 0 0;font-size:13px;font-weight:700;color:#a1a1aa;letter-spacing:0.03em;">Website</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SENDER DETAILS -->
          <tr>
            <td style="background:#0f0f11;border:1px solid #27272a;border-top:none;border-bottom:none;padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #27272a;padding:24px 0;">
                <tr>
                  <td width="33%" style="padding-right:12px;">
                    <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#52525b;font-weight:600;">Name</p>
                    <p style="margin:0;font-size:15px;color:#e4e4e7;font-weight:500;">${name}</p>
                  </td>
                  <td width="33%" style="padding-left:12px;padding-right:12px;">
                    <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#52525b;font-weight:600;">Email</p>
                    <a href="mailto:${email}" style="margin:0;font-size:15px;color:#60a5fa;text-decoration:none;font-weight:500;">${email}</a>
                  </td>
                  <td width="33%" style="padding-left:12px;">
                    <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#52525b;font-weight:600;">Mobile</p>
                    <a href="tel:${mobile}" style="margin:0;font-size:15px;color:#60a5fa;text-decoration:none;font-weight:500;">${mobile}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MESSAGE -->
          <tr>
            <td style="background:#0f0f11;border:1px solid #27272a;border-top:1px solid #27272a;border-bottom:none;padding:24px 40px;">
              <p style="margin:0 0 10px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#52525b;font-weight:600;">Message</p>
              <div style="background:#09090b;border:1px solid #27272a;border-left:3px solid #3b82f6;border-radius:8px;padding:16px 20px;">
                <p style="margin:0;font-size:14px;color:#d4d4d8;line-height:1.7;white-space:pre-wrap;">${message}</p>
              </div>
            </td>
          </tr>

          <!-- QUICK ACTIONS HINT -->
          <tr>
            <td style="background:#0f0f11;border:1px solid #27272a;border-top:none;border-bottom:none;padding:20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display:inline-block;background:#18181b;border:1px solid #27272a;border-radius:8px;padding:6px 14px;font-size:12px;color:#a1a1aa;font-weight:500;margin-right:8px;">
                      ✉ Reply to ${email}
                    </span>
                    <span style="display:inline-block;background:#18181b;border:1px solid #27272a;border-radius:8px;padding:6px 14px;font-size:12px;color:#a1a1aa;font-weight:500;">
                      📞 Call ${mobile}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- METADATA STRIP -->
          <tr>
            <td style="background:#0f0f11;border:1px solid #27272a;border-top:none;border-bottom:none;padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1f1f22;padding:16px 0;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;color:#3f3f46;font-family:'Courier New',monospace;">
                      RECEIVED &nbsp;·&nbsp; ${submittedAt}
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:11px;color:#3f3f46;font-family:'Courier New',monospace;">
                      VIA CONTACT FORM
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#09090b;border:1px solid #27272a;border-top:1px solid #27272a;border-radius:0 0 16px 16px;padding:20px 40px;">
              <p style="margin:0;font-size:11px;color:#3f3f46;text-align:center;letter-spacing:0.05em;">
                Auto-generated by Contact Form &nbsp;·&nbsp; Hit reply to respond directly to ${name}
              </p>
            </td>
          </tr>

          <!-- BOTTOM ACCENT BAR -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,transparent,#3b82f6,transparent);border-radius:0 0 4px 4px;"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"Contact Form" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}