import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface SubmissionPayload {
  author:    string;
  email:     string;
  role:      string;
  category:  string;
  severity:  string;
  title:     string;
  duration:  string;
  tags:      string;
  story:     string;
  lesson:    string;
  impact:    string;
  anonymous: boolean;
  consent:   boolean;
}

// ─── CASE ID GENERATOR ────────────────────────────────────────────────────────
function generateCaseId(): string {
  const num = Math.floor(Math.random() * 900) + 100; // 100–999
  return `INC-${num}${Date.now().toString().slice(-2)}`; // e.g. INC-42573
}

// ─── EMAIL TEMPLATES ──────────────────────────────────────────────────────────

/** Internal email to CodeNFacts admin */
function buildAdminEmail(data: SubmissionPayload, caseId: string): string {
  const severityColor: Record<string, string> = {
    moderate:      "#2E7D32",
    severe:        "#7A3B1E",
    critical:      "#1A4A6B",
    catastrophic:  "#C0392B",
  };
  const color = severityColor[data.severity] ?? "#0E0C09";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { background: #F5F0E8; margin: 0; padding: 0; font-family: 'Courier New', monospace; }
    .wrap { max-width: 680px; margin: 0 auto; padding: 32px 20px; }
    .masthead-top { height: 8px; background: #0E0C09; }
    .masthead-acid { height: 3px; background: #D4FF00; }
    .masthead-bot { height: 1px; background: #0E0C09; margin-bottom: 28px; }
    .kicker { font-size: 10px; letter-spacing: 4px; color: #8C8070; margin-bottom: 6px; }
    h1 { font-family: Georgia, serif; font-size: 28px; font-weight: 900; color: #0E0C09; margin: 0 0 4px; line-height: 1.15; }
    .case-id { display: inline-block; border: 2px solid ${color}; padding: 4px 12px; font-size: 12px; letter-spacing: 3px; color: ${color}; margin-bottom: 20px; }
    .rule { border: none; border-top: 1px solid #C8BFA8; margin: 20px 0; }
    .section-label { font-size: 9px; letter-spacing: 4px; color: #8C8070; margin-bottom: 8px; text-transform: uppercase; }
    .field-val { font-size: 13px; color: #2A2520; line-height: 1.7; margin-bottom: 16px; }
    .stamp { display: inline-block; border: 2px solid ${color}; padding: 3px 10px; font-size: 11px; letter-spacing: 3px; color: ${color}; transform: rotate(-1.5deg); }
    .story-box { background: #EDE8DC; border-left: 4px solid ${color}; padding: 16px 18px; font-size: 13px; line-height: 1.9; color: #2A2520; white-space: pre-wrap; margin-bottom: 16px; }
    .lesson-box { background: #D4FF0022; border: 1.5px solid #D4FF00; border-left: 5px solid #A8CC00; padding: 14px 18px; font-size: 13px; line-height: 1.9; color: #0E0C09; white-space: pre-wrap; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; margin-bottom: 16px; }
    .meta-item .label { font-size: 9px; letter-spacing: 3px; color: #8C8070; }
    .meta-item .value { font-size: 13px; color: #0E0C09; font-weight: bold; }
    .footer { font-size: 10px; color: #8C8070; margin-top: 28px; border-top: 1px solid #C8BFA8; padding-top: 14px; line-height: 1.7; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="masthead-top"></div>
  <div class="masthead-acid"></div>
  <div class="masthead-bot"></div>

  <div class="kicker">CODENFACTS · FAILURE ARCHIVE · NEW SUBMISSION</div>
  <h1>New Incident Report Filed</h1>
  <br/>
  <span class="case-id">${caseId}</span>
  <span class="stamp" style="margin-left:10px">${data.severity.toUpperCase()}</span>

  <hr class="rule"/>

  <div class="meta-grid">
    <div class="meta-item"><div class="label">SUBMITTED BY</div><div class="value">${data.author}</div></div>
    <div class="meta-item"><div class="label">EMAIL</div><div class="value">${data.email}</div></div>
    <div class="meta-item"><div class="label">ROLE</div><div class="value">${data.role}</div></div>
    <div class="meta-item"><div class="label">CATEGORY</div><div class="value">${data.category}</div></div>
    <div class="meta-item"><div class="label">SEVERITY</div><div class="value">${data.severity.toUpperCase()}</div></div>
    <div class="meta-item"><div class="label">DOWNTIME</div><div class="value">${data.duration || "Not specified"}</div></div>
    <div class="meta-item"><div class="label">TAGS</div><div class="value">${data.tags || "—"}</div></div>
    <div class="meta-item"><div class="label">ANONYMOUS</div><div class="value">${data.anonymous ? "YES — publish anonymously" : "NO — use real name"}</div></div>
  </div>

  <hr class="rule"/>

  <div class="section-label">CASE TITLE</div>
  <div class="field-val" style="font-family:Georgia,serif;font-size:18px;font-weight:900;color:#0E0C09;">${data.title}</div>

  <div class="section-label">INCIDENT STORY</div>
  <div class="story-box">${data.story}</div>

  <div class="section-label">THE LESSON</div>
  <div class="lesson-box">${data.lesson}</div>

  ${data.impact ? `
  <div class="section-label">REAL-WORLD IMPACT</div>
  <div class="field-val">${data.impact}</div>
  ` : ""}

  <div class="footer">
    Case filed via CodeNFacts Failure Archive intake form.<br/>
    Submitter consented to publication: <strong>YES</strong><br/>
    Review and publish at: <a href="https://codenfacts.in/admin" style="color:#1A4A6B">codenfacts.in</a>
  </div>
</div>
</body>
</html>
  `.trim();
}

/** Confirmation email to the submitter */
function buildUserEmail(data: SubmissionPayload, caseId: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { background: #F5F0E8; margin:0; padding:0; font-family:'Courier New',monospace; }
    .wrap { max-width: 620px; margin: 0 auto; padding: 32px 20px; }
    .masthead-top { height: 8px; background: #0E0C09; }
    .masthead-acid { height: 3px; background: #D4FF00; }
    .masthead-bot { height: 1px; background: #0E0C09; margin-bottom: 28px; }
    .kicker { font-size: 10px; letter-spacing: 4px; color: #8C8070; margin-bottom: 8px; }
    h1 { font-family: Georgia, serif; font-size: 26px; font-weight: 900; color: #0E0C09; line-height: 1.2; margin: 0 0 16px; }
    .case-ref { background: #EDE8DC; border: 1px solid #C8BFA8; padding: 16px 20px; margin: 20px 0; }
    .case-ref .label { font-size: 9px; letter-spacing: 3px; color: #8C8070; margin-bottom: 6px; }
    .case-ref .id { font-family: Georgia, serif; font-size: 20px; letter-spacing: 5px; color: #1A4A6B; }
    .body-text { font-size: 13px; color: #2A2520; line-height: 1.9; margin-bottom: 16px; }
    .highlight { border-left: 4px solid #D4FF00; padding: 12px 16px; background: #D4FF0015; font-size: 13px; color: #0E0C09; line-height: 1.8; margin: 20px 0; }
    .rule { border: none; border-top: 1px solid #C8BFA8; margin: 20px 0; }
    .footer { font-size: 10px; color: #8C8070; margin-top: 24px; border-top: 1px solid #C8BFA8; padding-top: 14px; line-height: 1.8; }
    .btn { display: inline-block; background: #D4FF00; color: #0E0C09; font-family: Georgia, serif; font-size: 12px; letter-spacing: 3px; padding: 14px 28px; text-decoration: none; font-weight: 900; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="masthead-top"></div>
  <div class="masthead-acid"></div>
  <div class="masthead-bot"></div>

  <div class="kicker">CODENFACTS · FAILURE ARCHIVE</div>
  <h1>Your Case Has Been Filed, ${data.author.split(" ")[0]}.</h1>

  <p class="body-text">
    Thank you for submitting your incident report. Your failure is now in our archive queue and will be reviewed by the CodeNFacts team.
  </p>

  <div class="case-ref">
    <div class="label">YOUR CASE REFERENCE NUMBER</div>
    <div class="id">${caseId}</div>
  </div>

  <div class="highlight">
    Once reviewed, your case will be anonymized (as you selected) and published to the Failure Archive - where it will be read by thousands of developers who may be making the exact same mistake tomorrow.
  </div>

  <p class="body-text">
    What happens next:<br/>
    1. Our team reviews your submission for completeness and authenticity.<br/>
    2. We may reach out to ${data.email} if we need any clarification.<br/>
    3. Your case is formatted, assigned a case number, and published to the archive.<br/>
    4. Developers who search for your category of failure will find your lesson.
  </p>

  <hr class="rule"/>

  <p class="body-text" style="font-style:italic;color:#8C8070;">
    "Every catastrophe is a lesson that refused to be ignored."<br/>
    - CodeNFacts Failure Archive
  </p>

  <a href="https://codenfacts.in/failure-log" class="btn">VIEW THE ARCHIVE →</a>

  <div class="footer">
    You submitted this case from CodeNFacts.in. Your email will never be published or shared.<br/>
    If you need to update or withdraw your submission, reply to this email with your case reference: <strong>${caseId}</strong>
  </div>
</div>
</body>
</html>
  `.trim();
}

// ─── ROUTE HANDLER ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Parse body
    const body: SubmissionPayload = await req.json();

    // 2. Server-side validation
    const { author, email, role, category, severity, title, story, lesson, consent } = body;

    if (!author?.trim())   return NextResponse.json({ error: "Author name is required." }, { status: 400 });
    if (!email?.trim())    return NextResponse.json({ error: "Email is required." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    if (!role?.trim())     return NextResponse.json({ error: "Role is required." }, { status: 400 });
    if (!category?.trim()) return NextResponse.json({ error: "Category is required." }, { status: 400 });
    if (!severity?.trim()) return NextResponse.json({ error: "Severity is required." }, { status: 400 });
    if (!title?.trim() || title.length < 10) return NextResponse.json({ error: "Title must be at least 10 characters." }, { status: 400 });
    if (!story?.trim() || story.length < 100) return NextResponse.json({ error: "Story must be at least 100 characters." }, { status: 400 });
    if (story.length > 3000) return NextResponse.json({ error: "Story exceeds 3,000 character limit." }, { status: 400 });
    if (!lesson?.trim() || lesson.length < 40) return NextResponse.json({ error: "Lesson must be at least 40 characters." }, { status: 400 });
    if (!consent) return NextResponse.json({ error: "Consent is required." }, { status: 400 });

    // 3. Environment variables
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL ?? process.env.GMAIL_USER;

    if (!gmailUser || !gmailPass) {
      console.error("[submit-case] Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars.");
      return NextResponse.json({ error: "Email service not configured. Please contact us directly." }, { status: 500 });
    }

    // 4. Generate case ID
    const caseId = generateCaseId();

    // 5. Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass, // Use Gmail App Password (not your login password)
      },
    });

    // 6. Send admin notification
    await transporter.sendMail({
      from:    `"CodeNFacts Archive" <${gmailUser}>`,
      to:      adminEmail,
      subject: `[NEW CASE] ${caseId} - ${title}`,
      html:    buildAdminEmail(body, caseId),
    });

    // 7. Send confirmation to submitter
    await transporter.sendMail({
      from:    `"CodeNFacts Failure Archive" <${gmailUser}>`,
      to:      email,
      subject: `Case Filed: ${caseId} - Your Failure Is Now Someone's Lesson`,
      html:    buildUserEmail(body, caseId),
    });

    // 8. Return success
    return NextResponse.json({ success: true, caseId }, { status: 200 });

  } catch (err: any) {
    console.error("[submit-case] Error:", err?.message ?? err);
    return NextResponse.json(
      { error: "Failed to send. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}