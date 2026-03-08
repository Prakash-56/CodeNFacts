/*app/api/send-mentorship/route.ts*/
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName, lastName, email, mobile,
      education, experience, placementGoal, message,
    } = body;

    if (!firstName || !lastName || !email || !mobile || !education || !placementGoal || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const sharedStyles = `
      body { font-family: 'Segoe UI', sans-serif; background: #f4f6ff; margin: 0; padding: 0; }
      .wrapper { max-width: 620px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 30px rgba(99,102,241,0.15); }
      .header { background: linear-gradient(135deg, #4f46e5, #9333ea); padding: 36px 40px; color: white; }
      .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
      .header p { margin: 8px 0 0; opacity: 0.8; font-size: 14px; }
      .body { padding: 36px 40px; }
      .row { display: flex; gap: 20px; margin-bottom: 20px; }
      .field { flex: 1; }
      .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #6366f1; margin-bottom: 6px; }
      .value { font-size: 15px; color: #111827; font-weight: 500; background: #f5f3ff; border-radius: 8px; padding: 10px 14px; }
      .message-box { background: #f5f3ff; border-radius: 10px; padding: 16px 20px; color: #111827; font-size: 15px; line-height: 1.7; white-space: pre-wrap; }
      .footer { background: #fafafa; border-top: 1px solid #ede9fe; padding: 20px 40px; font-size: 12px; color: #9ca3af; text-align: center; }
      .badge { display: inline-block; background: #ede9fe; color: #6366f1; border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 700; }
      .divider { border: none; border-top: 1px solid #ede9fe; margin: 24px 0; }
    `;

    // ── Admin notification ────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"Mentorship App" <${process.env.SMTP_USER}>`,
      to: process.env.MENTOR_EMAIL,
      replyTo: email,
      subject: `🎓 New Mentorship Application – ${firstName} ${lastName} (${placementGoal})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${sharedStyles}</style></head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>🎓 New Mentorship Application</h1>
              <p>Submitted on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
            <div class="body">
              <div class="row">
                <div class="field"><div class="label">First Name</div><div class="value">${firstName}</div></div>
                <div class="field"><div class="label">Last Name</div><div class="value">${lastName}</div></div>
              </div>
              <div class="row">
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${email}" style="color:#6366f1;text-decoration:none">${email}</a></div>
                </div>
                <div class="field"><div class="label">Mobile</div><div class="value">${mobile}</div></div>
              </div>
              <div class="row">
                <div class="field"><div class="label">Education</div><div class="value">${education}</div></div>
                <div class="field"><div class="label">Experience</div><div class="value">${experience || 'Not specified'}</div></div>
              </div>
              <div class="row">
                <div class="field" style="flex:unset">
                  <div class="label">Placement Goal</div>
                  <span class="badge">${placementGoal}</span>
                </div>
              </div>
              <div style="margin-top:24px">
                <div class="label">Why they want mentorship</div>
                <div class="message-box">${message}</div>
              </div>
            </div>
            <div class="footer">
              This email was sent from your mentorship application form.<br/>
              Reply directly to <strong>${email}</strong> to contact the applicant.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // ── User confirmation ─────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"Mentorship Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `🎓 Application Received, ${firstName}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>${sharedStyles}</style></head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>🎉 You're In the Queue!</h1>
              <p>Application confirmed · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
            <div class="body">
              <p style="color:#111827;font-size:16px;line-height:1.7;margin:0 0 24px;">
                Hi <strong>${firstName}</strong>,<br/><br/>
                We've successfully received your mentorship application. Our team will review your submission and get back to you soon with the next steps.
              </p>
              <hr class="divider" />
              <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6366f1;margin:0 0 16px;">Your Submission Summary</p>
              <div class="row">
                <div class="field"><div class="label">Name</div><div class="value">${firstName} ${lastName}</div></div>
                <div class="field"><div class="label">Mobile</div><div class="value">${mobile}</div></div>
              </div>
              <div class="row">
                <div class="field"><div class="label">Education</div><div class="value">${education}</div></div>
                <div class="field"><div class="label">Experience</div><div class="value">${experience || 'Not specified'}</div></div>
              </div>
              <div class="row">
                <div class="field" style="flex:unset">
                  <div class="label">Placement Goal</div>
                  <span class="badge">${placementGoal}</span>
                </div>
              </div>
              <div style="margin-top:24px">
                <div class="label">Your Message</div>
                <div class="message-box">${message}</div>
              </div>
              <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;line-height:1.6;">
                If you did not submit this application, please disregard this email.
              </p>
            </div>
            <div class="footer">
              This is an automated confirmation · Please do not reply to this email
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send email.' }, { status: 500 });
  }
}