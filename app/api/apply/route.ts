import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ─── Types ────────────────────────────────────────────────────────────────────

type ApplicationBody = {
  // Personal
  name: string;
  email: string;
  phone: string;
  // Academic
  college: string;
  degree: string;
  year: string;
  cgpa: string;
  // Links
  github: string;
  linkedin: string;
  portfolio: string;
  resume: string;
  // Experience
  experience: string;
  projects: string;
  // Motivation
  whyUs: string;
  availability: string;
  extraInfo: string;
  // Role meta
  role: string;
  dept: string;
  stipend: string;
  duration: string;
  mode: string;
};

// ─── HTML Helpers ─────────────────────────────────────────────────────────────

function row(label: string, value: string, accent = "#0AFF94") {
  if (!value || value.trim() === "") {
    return `
      <tr>
        <td style="padding:10px 16px;background:#0c0c0c;color:#444;font-size:10px;letter-spacing:2px;font-family:'Courier New',monospace;white-space:nowrap;border-bottom:1px solid #1a1a1a;vertical-align:top;width:160px;">${label.toUpperCase()}</td>
        <td style="padding:10px 16px;color:#333;font-size:12px;font-family:Arial,sans-serif;border-bottom:1px solid #1a1a1a;vertical-align:top;font-style:italic;">Not provided</td>
      </tr>`;
  }
  const isUrl = value.startsWith("http://") || value.startsWith("https://");
  const displayValue = isUrl
    ? `<a href="${value}" style="color:${accent};text-decoration:none;">${value}</a>`
    : value.replace(/\n/g, "<br/>");
  return `
    <tr>
      <td style="padding:10px 16px;background:#0c0c0c;color:#555;font-size:10px;letter-spacing:2px;font-family:'Courier New',monospace;white-space:nowrap;border-bottom:1px solid #1a1a1a;vertical-align:top;width:160px;">${label.toUpperCase()}</td>
      <td style="padding:10px 16px;color:#c8c8c8;font-size:13px;font-family:Arial,sans-serif;border-bottom:1px solid #1a1a1a;vertical-align:top;line-height:1.7;">${displayValue}</td>
    </tr>`;
}

function sectionHeader(title: string) {
  return `
    <tr>
      <td colspan="2" style="padding:10px 16px;background:#080808;border-bottom:1px solid #1a1a1a;border-top:2px solid #111;">
        <span style="font-size:9px;letter-spacing:4px;color:#333;font-family:'Courier New',monospace;">${title}</span>
      </td>
    </tr>`;
}

// ─── Admin Email HTML ─────────────────────────────────────────────────────────

function buildAdminHtml(data: ApplicationBody): string {
  const timestamp = new Date().toLocaleString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Internship Application</title>
</head>
<body style="margin:0;padding:0;background:#020202;">
<div style="max-width:680px;margin:0 auto;padding:28px 16px;font-family:Arial,sans-serif;">

  <!-- Top accent bar -->
  <div style="height:3px;background:linear-gradient(90deg,transparent,#0AFF94,transparent);margin-bottom:2px;"></div>

  <!-- Header block -->
  <div style="background:#080808;padding:28px 28px 22px;margin-bottom:2px;">
    <div style="margin-bottom:14px;">
      <span style="display:inline-block;background:#FF5C38;color:#000;font-size:9px;letter-spacing:3px;padding:4px 12px;font-family:'Courier New',monospace;font-weight:bold;">● NEW APPLICATION RECEIVED</span>
    </div>
    <h1 style="font-size:32px;color:#ffffff;letter-spacing:3px;margin:0 0 6px;font-family:Arial Black,Arial,sans-serif;line-height:1.1;">INTERNSHIP APPLICATION</h1>
    <p style="font-size:11px;color:#0AFF94;letter-spacing:3px;font-family:'Courier New',monospace;margin:0;">CodeNFacts · ${timestamp} IST</p>
  </div>

  <!-- Role highlight -->
  <div style="background:#0AFF9410;border:1px solid #0AFF9440;padding:18px 24px;margin-bottom:2px;">
    <p style="font-size:9px;letter-spacing:4px;color:#0AFF94;font-family:'Courier New',monospace;margin:0 0 5px;">ROLE APPLIED FOR</p>
    <p style="font-size:26px;color:#ffffff;letter-spacing:2px;margin:0 0 5px;font-family:Arial Black,Arial,sans-serif;">${data.role || "—"}</p>
    <p style="font-size:10px;color:#555;font-family:'Courier New',monospace;letter-spacing:2px;margin:0;">
      ${[data.dept, data.stipend, data.duration, data.mode].filter(Boolean).join(" · ")}
    </p>
  </div>

  <!-- All fields table -->
  <table style="width:100%;border-collapse:collapse;background:#080808;margin-bottom:2px;">

    ${sectionHeader("01 - PERSONAL DETAILS")}
    ${row("Full Name", data.name)}
    ${row("Email", data.email)}
    ${row("Phone", data.phone)}

    ${sectionHeader("02 - ACADEMIC BACKGROUND")}
    ${row("College / University", data.college)}
    ${row("Degree Program", data.degree)}
    ${row("Year / Status", data.year)}
    ${row("CGPA / Percentage", data.cgpa)}

    ${sectionHeader("03 - ONLINE PRESENCE")}
    ${row("GitHub", data.github)}
    ${row("LinkedIn", data.linkedin)}
    ${row("Portfolio", data.portfolio)}
    ${row("Resume Link", data.resume)}

    ${sectionHeader("04 - EXPERIENCE & PROJECTS")}
    ${row("Relevant Experience", data.experience)}
    ${row("Top Projects", data.projects)}

    ${sectionHeader("05 - MOTIVATION")}
    ${row("Why CodeNFacts?", data.whyUs)}
    ${row("Availability", data.availability)}
    ${row("Additional Info", data.extraInfo)}

  </table>

  <!-- Quick action reminder -->
  <div style="background:#080808;border:1px solid #111;padding:18px 24px;margin-bottom:2px;">
    <p style="font-size:9px;letter-spacing:4px;color:#333;font-family:'Courier New',monospace;margin:0 0 10px;">NEXT STEPS</p>
    <p style="font-size:12px;color:#484848;font-family:Arial,sans-serif;line-height:1.7;margin:0;">
      Reply to this email to respond directly to <span style="color:#c0c0c0;">${data.name}</span> at 
      <a href="mailto:${data.email}" style="color:#0AFF94;text-decoration:none;">${data.email}</a>.
      Schedule a screening call, request more info, or send an offer - all from your inbox.
    </p>
  </div>

  <!-- Footer -->
  <div style="padding:18px 0;text-align:center;border-top:1px solid #0d0d0d;">
    <p style="font-size:9px;letter-spacing:3px;color:#1a1a1a;font-family:'Courier New',monospace;margin:0;">CodeNfacts INTERNSHIP PORTAL · ${new Date().getFullYear()}</p>
  </div>

</div>
</body>
</html>`.trim();
}

// ─── Applicant Confirmation Email HTML ────────────────────────────────────────

function buildApplicantHtml(data: ApplicationBody): string {
  const steps = [
    "Application review - we'll read everything carefully (24-48 hrs)",
    "Screening call - 20 min informal chat, no whiteboard stress",
    "Take-home task - role-specific, 2-4 hrs, paid if you reach this stage",
    "Offer - sent within 48 hrs of task review if it's a match",
  ];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Application Received</title>
</head>
<body style="margin:0;padding:0;background:#020202;">
<div style="max-width:580px;margin:0 auto;padding:28px 16px;font-family:Arial,sans-serif;">

  <!-- Top accent bar -->
  <div style="height:3px;background:linear-gradient(90deg,transparent,#0AFF94,transparent);margin-bottom:2px;"></div>

  <!-- Header -->
  <div style="background:#080808;padding:28px 28px 22px;margin-bottom:2px;">
    <h1 style="font-size:30px;color:#ffffff;letter-spacing:3px;margin:0 0 8px;font-family:Arial Black,Arial,sans-serif;">APPLICATION RECEIVED ✓</h1>
    <p style="font-size:11px;color:#0AFF94;letter-spacing:3px;font-family:'Courier New',monospace;margin:0;">CodeNFacts · We'll be in touch shortly.</p>
  </div>

  <!-- Message body -->
  <div style="background:#080808;border:1px solid #111;padding:28px;margin-bottom:2px;">
    <p style="font-size:15px;color:#c0c0c0;line-height:1.8;margin:0 0 16px;">
      Hey <strong style="color:#ffffff;">${data.name}</strong>,
    </p>
    <p style="font-size:13px;color:#555;line-height:1.8;margin:0 0 14px;">
      Your application for the <strong style="color:#0AFF94;">${data.role}</strong> internship is safely with our team. We read every application - no automated filtering, no keyword matching.
    </p>
    <p style="font-size:13px;color:#555;line-height:1.8;margin:0 0 14px;">
      Expect a response at <a href="mailto:${data.email}" style="color:#ffffff;text-decoration:none;">${data.email}</a> within <strong style="color:#fff;">24-48 hours</strong>. If you don't hear from us, check your spam folder first - then reply to this email.
    </p>
    <p style="font-size:13px;color:#555;line-height:1.8;margin:0;">
      One quick thing: make sure your <strong style="color:#c0c0c0;">resume link</strong> and any portfolio / GitHub links are publicly accessible. If they're behind a login, we won't be able to view them.
    </p>
  </div>

  <!-- What you applied for -->
  <div style="background:#0AFF9408;border:1px solid #0AFF9422;padding:18px 24px;margin-bottom:2px;">
    <p style="font-size:9px;letter-spacing:4px;color:#0AFF94;font-family:'Courier New',monospace;margin:0 0 5px;">YOUR APPLICATION SUMMARY</p>
    <p style="font-size:22px;color:#ffffff;letter-spacing:2px;margin:0 0 4px;font-family:Arial Black,Arial,sans-serif;">${data.role}</p>
    <p style="font-size:10px;color:#444;font-family:'Courier New',monospace;letter-spacing:2px;margin:0 0 12px;">
      ${[data.dept, data.stipend, data.duration, data.mode].filter(Boolean).join(" · ")}
    </p>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="font-size:10px;color:#333;font-family:'Courier New',monospace;letter-spacing:2px;padding:3px 0;">NAME</td>
        <td style="font-size:12px;color:#888;font-family:Arial,sans-serif;padding:3px 0 3px 12px;">${data.name}</td>
      </tr>
      <tr>
        <td style="font-size:10px;color:#333;font-family:'Courier New',monospace;letter-spacing:2px;padding:3px 0;">COLLEGE</td>
        <td style="font-size:12px;color:#888;font-family:Arial,sans-serif;padding:3px 0 3px 12px;">${data.college || "—"}</td>
      </tr>
      <tr>
        <td style="font-size:10px;color:#333;font-family:'Courier New',monospace;letter-spacing:2px;padding:3px 0;">YEAR</td>
        <td style="font-size:12px;color:#888;font-family:Arial,sans-serif;padding:3px 0 3px 12px;">${data.year || "—"}</td>
      </tr>
      <tr>
        <td style="font-size:10px;color:#333;font-family:'Courier New',monospace;letter-spacing:2px;padding:3px 0;">AVAILABILITY</td>
        <td style="font-size:12px;color:#888;font-family:Arial,sans-serif;padding:3px 0 3px 12px;">${data.availability || "—"}</td>
      </tr>
    </table>
  </div>

  <!-- What happens next -->
  <div style="background:#080808;border:1px solid #111;padding:24px 28px;margin-bottom:2px;">
    <p style="font-size:9px;letter-spacing:4px;color:#333;font-family:'Courier New',monospace;margin:0 0 16px;">WHAT HAPPENS NEXT</p>
    ${steps.map((s, i) => `
    <div style="display:flex;align-items:flex-start;padding:9px 0;border-bottom:1px solid #0f0f0f;">
      <span style="font-family:'Courier New',monospace;font-size:10px;color:#0AFF9455;min-width:26px;padding-top:2px;flex-shrink:0;">0${i + 1}</span>
      <span style="font-size:12px;color:#484848;font-family:Arial,sans-serif;line-height:1.6;">${s}</span>
    </div>`).join("")}
  </div>

  <!-- Sign-off -->
  <div style="background:#080808;padding:22px 28px;margin-bottom:2px;">
    <p style="font-size:13px;color:#3a3a3a;font-family:Arial,sans-serif;line-height:1.7;margin:0;">
      Good luck - though if your application is strong, you won't need it.<br/>
      <span style="color:#555;">⁓ The CodeNFacts Team</span>
    </p>
  </div>

  <!-- Footer -->
  <div style="padding:18px 0;text-align:center;border-top:1px solid #0d0d0d;">
    <p style="font-size:9px;letter-spacing:3px;color:#1a1a1a;font-family:'Courier New',monospace;margin:0;">CodeNFacts · codenfacts.in · ${new Date().getFullYear()}</p>
  </div>

</div>
</body>
</html>`.trim();
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let data: ApplicationBody;

  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Basic validation
  if (!data.name || !data.email || !data.phone || !data.role) {
    return NextResponse.json({ error: "Missing required fields: name, email, phone, role" }, { status: 400 });
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS, // 16-char App Password from Google Account settings
    },
  });

  try {
    // 1 ── Admin email with ALL fields
    await transport.sendMail({
      from: `"CodeNFacts Applications" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: data.email,
      subject: `[Application] ${data.role} - ${data.name} (${data.college || "no college"})`,
      html: buildAdminHtml(data),
      // Plain text fallback with every single field
      text: `
NEW INTERNSHIP APPLICATION — CodeNFacts
==========================================

ROLE:         ${data.role}
DEPT:         ${data.dept}
STIPEND:      ${data.stipend}
DURATION:     ${data.duration}
MODE:         ${data.mode}

── PERSONAL ──────────────────────────────
NAME:         ${data.name}
EMAIL:        ${data.email}
PHONE:        ${data.phone}

── ACADEMIC ──────────────────────────────
COLLEGE:      ${data.college || "—"}
DEGREE:       ${data.degree || "—"}
YEAR:         ${data.year || "—"}
CGPA:         ${data.cgpa || "—"}

── LINKS ─────────────────────────────────
GITHUB:       ${data.github || "—"}
LINKEDIN:     ${data.linkedin || "—"}
PORTFOLIO:    ${data.portfolio || "—"}
RESUME:       ${data.resume || "—"}

── EXPERIENCE & PROJECTS ─────────────────
EXPERIENCE:
${data.experience || "—"}

PROJECTS:
${data.projects || "—"}

── MOTIVATION ────────────────────────────
WHY US:
${data.whyUs || "—"}

AVAILABILITY: ${data.availability || "—"}

EXTRA INFO:
${data.extraInfo || "—"}

==========================================
Reply to this email to respond directly to ${data.name} at ${data.email}.
      `.trim(),
    });

    // 2 ── Confirmation email to applicant
    await transport.sendMail({
      from: `"CodeNFacts" <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: `We received your application for ${data.role} ✓`,
      html: buildApplicantHtml(data),
      text: `
Hey ${data.name},

We've received your application for the ${data.role} internship at CodeNFacts.

Our team will review it and get back to you at ${data.email} within 24-48 hours.

What happens next:
1. Application review (24-48 hrs)
2. Screening call (20 min)
3. Take-home task (2-4 hrs, paid)
4. Offer within 48 hrs of task review

Make sure your resume and portfolio links are publicly accessible.

∽৹ The CodeNFacts Team
      `.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Nodemailer error:", err);
    return NextResponse.json({ error: "Failed to send email. Check server logs." }, { status: 500 });
  }
}