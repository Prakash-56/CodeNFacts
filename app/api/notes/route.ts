import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/* ── Types ── */
interface NotesRequest {
  name:         string;
  topic:        string;
  context:      string;
  depth:        'beginner' | 'intermediate' | 'advanced';
  format:       'structured-notes' | 'cheatsheet' | 'deep-dive' | 'qa-flashcards';
  expectations: string;
  gmail:        string;
}

/* ── Nodemailer transporter ──
   Env vars required in .env.local:
     GMAIL_USER   = your-admin-email@gmail.com
     GMAIL_PASS   = your-gmail-app-password  (Google App Password, NOT your real password)
     ADMIN_EMAIL  = email where you receive all requests (can be same as GMAIL_USER)
*/
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
}

/* ── Format labels ── */
const formatLabel: Record<string, string> = {
  'structured-notes': 'Structured Notes',
  'cheatsheet':       'Cheat Sheet',
  'deep-dive':        'Deep Dive',
  'qa-flashcards':    'Q&A / Flashcards',
};

/* ── Admin notification email (HTML) ── */
function buildAdminEmail(data: NotesRequest, ref: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #0f0f11; font-family: 'Segoe UI', sans-serif; color: #e5e7eb; padding: 40px 20px; }
      .card { max-width: 600px; margin: auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; }
      .header { background: linear-gradient(135deg, #4f46e5, #06b6d4); padding: 32px; }
      .header h1 { font-size: 22px; font-weight: 700; color: #fff; }
      .header p  { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px; }
      .body { padding: 28px; }
      .row { margin-bottom: 20px; }
      .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #6366f1; margin-bottom: 6px; }
      .value { font-size: 14px; color: #d1d5db; line-height: 1.6; background: #09090b; border: 1px solid #27272a; border-radius: 8px; padding: 10px 14px; white-space: pre-wrap; }
      .badge { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 12px; font-weight: 600;
               background: #312e81; color: #a5b4fc; border: 1px solid #4338ca; }
      .footer { padding: 20px 28px; border-top: 1px solid #27272a; font-size: 12px; color: #52525b; text-align: center; }
      .ref { font-family: monospace; color: #71717a; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <h1>📬 New Notes Request</h1>
        <p>Submitted via AskNotes · Ref <span style="font-family:monospace">${ref}</span></p>
      </div>
      <div class="body">
        <div class="row">
          <div class="label">Requester</div>
          <div class="value">${data.name} &lt;${data.gmail}&gt;</div>
        </div>
        <div class="row">
          <div class="label">Topic</div>
          <div class="value">${data.topic}</div>
        </div>
        <div class="row">
          <div class="label">Why they need this</div>
          <div class="value">${data.context}</div>
        </div>
        <div class="row">
          <div class="label">Depth &amp; Format</div>
          <div class="value">
            <span class="badge">${data.depth.charAt(0).toUpperCase() + data.depth.slice(1)}</span>
            &nbsp;&nbsp;
            <span class="badge">${formatLabel[data.format] ?? data.format}</span>
          </div>
        </div>
        <div class="row">
          <div class="label">Specific expectations</div>
          <div class="value">${data.expectations}</div>
        </div>
        <div class="row">
          <div class="label">Deliver to</div>
          <div class="value">${data.gmail}</div>
        </div>
      </div>
      <div class="footer">
        <span class="ref">ref:${ref}</span> · AskNotes Platform
      </div>
    </div>
  </body>
  </html>
  `;
}

/* ── User confirmation email (HTML) ── */
function buildUserEmail(data: NotesRequest, ref: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #0f0f11; font-family: 'Segoe UI', sans-serif; color: #e5e7eb; padding: 40px 20px; }
      .card { max-width: 580px; margin: auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; }
      .header { padding: 36px; text-align: center; background: #09090b; border-bottom: 1px solid #27272a; }
      .icon { font-size: 40px; margin-bottom: 16px; }
      .header h1 { font-size: 24px; font-weight: 700; color: #fff; }
      .header p  { font-size: 14px; color: #71717a; margin-top: 6px; }
      .body { padding: 32px; }
      .highlight { background: linear-gradient(135deg, #312e81, #1e3a5f); border: 1px solid #4f46e5; border-radius: 10px; padding: 18px 20px; margin-bottom: 24px; }
      .highlight p { font-size: 13px; color: #a5b4fc; line-height: 1.7; }
      .summary-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #6366f1; margin-bottom: 8px; }
      .summary-value { font-size: 14px; color: #d1d5db; margin-bottom: 18px; }
      .divider { height: 1px; background: #27272a; margin: 24px 0; }
      .footer-note { font-size: 12px; color: #52525b; line-height: 1.6; text-align: center; }
      .ref { font-family: monospace; color: #6366f1; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="icon">✦</div>
        <h1>Request Received, ${data.name.split(' ')[0]}</h1>
        <p>Your notes request is in the queue.</p>
      </div>
      <div class="body">
        <div class="highlight">
          <p>
            Our team will manually review your request, write precision notes tailored to your depth and format preferences,
            and deliver them directly to this inbox - typically within <strong style="color:#fff">24-48 hours</strong>.
          </p>
        </div>

        <div class="summary-label">Your request summary</div>

        <div class="summary-value"><strong style="color:#fff">Topic:</strong> ${data.topic}</div>
        <div class="summary-value"><strong style="color:#fff">Depth:</strong> ${data.depth.charAt(0).toUpperCase() + data.depth.slice(1)}</div>
        <div class="summary-value"><strong style="color:#fff">Format:</strong> ${formatLabel[data.format] ?? data.format}</div>

        <div class="divider"></div>

        <div class="footer-note">
          Reference: <span class="ref">${ref}</span><br/>
          Keep this for any follow-up queries. Do not reply to this email - it is automated.
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

/* ── Route Handler ── */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as NotesRequest;

    // Basic server-side validation
    const { name, topic, context, depth, format, expectations, gmail } = body;
    if (!name || !topic || !context || !depth || !format || !expectations || !gmail) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail)) {
      return NextResponse.json({ error: 'Invalid Gmail address.' }, { status: 400 });
    }

    // Generate reference ID
    const ref = `ANR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const transporter = createTransporter();

    // 1️⃣  Notify admin
    await transporter.sendMail({
      from:    `"AskNotes" <${process.env.GMAIL_USER}>`,
      to:      process.env.ADMIN_EMAIL ?? process.env.GMAIL_USER,
      subject: `[AskNotes] New Request - ${topic} (${ref})`,
      html:    buildAdminEmail(body, ref),
    });

    // 2️⃣  Confirm to user
    await transporter.sendMail({
      from:    `"AskNotes" <${process.env.GMAIL_USER}>`,
      to:      gmail,
      subject: `Your AskNotes request has been received [${ref}]`,
      html:    buildUserEmail(body, ref),
    });

    return NextResponse.json({ success: true, ref }, { status: 200 });

  } catch (err) {
    console.error('[/api/notes] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}