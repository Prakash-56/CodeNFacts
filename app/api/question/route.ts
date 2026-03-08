/*app/api/question/route.ts*/
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, mobile, education, experience, placementGoal, message } = await req.json();

    if (!firstName || !lastName || !email || !mobile || !education || !experience || !placementGoal || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const sharedStyles = `
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
      .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%); padding: 36px 40px; }
      .header h1 { color: #fff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
      .header p { color: rgba(255,255,255,0.75); margin: 8px 0 0; font-size: 14px; }
      .body { padding: 36px 40px; }
      .field { margin-bottom: 20px; }
      .field label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #6366f1; margin-bottom: 4px; }
      .field value { display: block; font-size: 15px; color: #1e1b4b; font-weight: 500; }
      .divider { border: none; border-top: 1px solid #ede9fe; margin: 24px 0; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px; }
      .message-box { background: #f5f3ff; border-left: 4px solid #7c3aed; border-radius: 8px; padding: 16px 20px; margin-top: 8px; }
      .message-box p { margin: 0; color: #3b0764; font-size: 15px; line-height: 1.7; }
      .footer { background: #f5f3ff; padding: 20px 40px; text-align: center; }
      .footer p { color: #a78bfa; font-size: 12px; margin: 0; }
    `;

    // ── Admin notification ────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"Mentorship Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Question Application ${firstName} ${lastName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8" /><style>${sharedStyles}</style></head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Mentorship Application</h1>
                <p>Submitted via your website · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
              </div>
              <div class="body">
                <div class="grid">
                  <div class="field"><label>First Name</label><value>${firstName}</value></div>
                  <div class="field"><label>Last Name</label><value>${lastName}</value></div>
                </div>
                <hr class="divider" />
                <div class="field">
                  <label>Email Address</label>
                  <value><a href="mailto:${email}" style="color:#4f46e5;text-decoration:none;">${email}</a></value>
                </div>
                <div class="field"><label>Mobile Number</label><value>${mobile}</value></div>
                <hr class="divider" />
                <div class="grid">
                  <div class="field"><label>Education Level</label><value>${education}</value></div>
                  <div class="field"><label>Placement Goal</label><value>${placementGoal}</value></div>
                </div>
                <div class="field"><label>Work / Project Experience</label><value>${experience}</value></div>
                <hr class="divider" />
                <div class="field">
                  <label>Why They Want This Mentorship</label>
                  <div class="message-box"><p>${message.replace(/\n/g, '<br/>')}</p></div>
                </div>
              </div>
              <div class="footer">
                <p>Reply to this email to contact the applicant directly at ${email}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // ── User confirmation ─────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"Mentorship Team" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `We've received your application, ${firstName}!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8" /><style>${sharedStyles}</style></head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Application Received! 🎉</h1>
                <p>Thank you for applying · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
              </div>
              <div class="body">
                <p style="color:#1e1b4b;font-size:16px;line-height:1.7;margin:0 0 24px;">
                  Hi <strong>${firstName}</strong>,<br/><br/>
                  Thank you for submitting your mentorship application! We've received your details and will review them shortly. We'll be in touch with next steps soon.
                </p>
                <hr class="divider" />
                <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#6366f1;margin:0 0 16px;">Your Submission Summary</p>
                <div class="grid">
                  <div class="field"><label>Name</label><value>${firstName} ${lastName}</value></div>
                  <div class="field"><label>Mobile</label><value>${mobile}</value></div>
                </div>
                <div class="grid">
                  <div class="field"><label>Education</label><value>${education}</value></div>
                  <div class="field"><label>Placement Goal</label><value>${placementGoal}</value></div>
                </div>
                <div class="field"><label>Experience</label><value>${experience}</value></div>
                <hr class="divider" />
                <div class="field">
                  <label>Your Message</label>
                  <div class="message-box"><p>${message.replace(/\n/g, '<br/>')}</p></div>
                </div>
                <p style="color:#6b7280;font-size:13px;margin:24px 0 0;line-height:1.6;">
                  If you did not submit this application or believe this was sent in error, please ignore this email.
                </p>
              </div>
              <div class="footer">
                <p>This is an automated confirmation · Please do not reply to this email</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}