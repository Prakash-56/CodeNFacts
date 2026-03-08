// app/api/submit-issue/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { from_name, from_email, issue_category, severity, description, steps, ticket_id } = body;

    // ── Validate ────────────────────────────────────────────────────────────
    if (!from_name || !from_email || !issue_category || !severity || !description || !steps) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // ── Nodemailer transporter using Gmail App Password ──────────────────────
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ISSUE_EMAIL,
        pass: process.env.ISSUE_EMAIL_PASS,
      },
    });

    const severityColor: Record<string, string> = {
      Low: '#22c55e',
      Medium: '#f59e0b',
      High: '#f97316',
      Critical: '#ef4444',
    };

    const categoryEmoji: Record<string, string> = {
      'Bug Report': '🐛',
      'Performance Issue': '⚡',
      'Security Vulnerability': '🔒',
      'Feature Request': '✨',
    };

    const color = severityColor[severity] ?? '#6b7280';
    const emoji = categoryEmoji[issue_category] ?? '📋';

    // ── HTML email ───────────────────────────────────────────────────────────
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Issue Report #${ticket_id}</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- TOP ACCENT BAR -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,transparent,#dc2626,transparent);border-radius:4px 4px 0 0;"></td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td style="background:#111113;border:1px solid #27272a;border-bottom:none;border-radius:16px 16px 0 0;padding:36px 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#71717a;font-weight:600;">
                      Engineering Support
                    </p>
                    <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.03em;font-family:Georgia,serif;">
                      Issue Report ${emoji}
                    </h1>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:10px 16px;text-align:center;">
                      <p style="margin:0;font-size:10px;color:#52525b;text-transform:uppercase;letter-spacing:0.1em;">Ticket</p>
                      <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#a1a1aa;letter-spacing:0.05em;">#${ticket_id}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- REPORTER INFO -->
          <tr>
            <td style="background:#0f0f11;border:1px solid #27272a;border-top:none;border-bottom:none;padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #27272a;padding:24px 0;">
                <tr>
                  <td width="50%" style="padding-right:12px;">
                    <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#52525b;font-weight:600;">Reporter</p>
                    <p style="margin:0;font-size:15px;color:#e4e4e7;font-weight:500;">${from_name}</p>
                  </td>
                  <td width="50%" style="padding-left:12px;">
                    <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#52525b;font-weight:600;">Email</p>
                    <a href="mailto:${from_email}" style="margin:0;font-size:15px;color:#60a5fa;text-decoration:none;font-weight:500;">${from_email}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BADGES ROW -->
          <tr>
            <td style="background:#0f0f11;border:1px solid #27272a;border-top:none;border-bottom:none;padding:0 40px 24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:10px;">
                    <span style="display:inline-block;background:#18181b;border:1px solid #27272a;border-radius:8px;padding:6px 14px;font-size:12px;color:#a1a1aa;font-weight:500;">
                      ${emoji} ${issue_category}
                    </span>
                  </td>
                  <td>
                    <span style="display:inline-block;background:${color}18;border:1px solid ${color}50;border-radius:8px;padding:6px 14px;font-size:12px;font-weight:700;color:${color};">
                      ● ${severity} Severity
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- DESCRIPTION -->
          <tr>
            <td style="background:#0f0f11;border:1px solid #27272a;border-top:1px solid #27272a;border-bottom:none;padding:24px 40px;">
              <p style="margin:0 0 10px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#52525b;font-weight:600;">Description</p>
              <div style="background:#09090b;border:1px solid #27272a;border-left:3px solid #dc2626;border-radius:8px;padding:16px 20px;">
                <p style="margin:0;font-size:14px;color:#d4d4d8;line-height:1.7;white-space:pre-wrap;">${description}</p>
              </div>
            </td>
          </tr>

          <!-- STEPS TO REPRODUCE -->
          <tr>
            <td style="background:#0f0f11;border:1px solid #27272a;border-top:none;border-bottom:none;padding:24px 40px;">
              <p style="margin:0 0 10px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#52525b;font-weight:600;">Steps to Reproduce</p>
              <div style="background:#09090b;border:1px solid #27272a;border-left:3px solid #3b82f6;border-radius:8px;padding:16px 20px;">
                <p style="margin:0;font-size:13px;color:#d4d4d8;line-height:1.8;white-space:pre-wrap;font-family:'Courier New',monospace;">${steps}</p>
              </div>
            </td>
          </tr>

          <!-- METADATA STRIP -->
          <tr>
            <td style="background:#0f0f11;border:1px solid #27272a;border-top:none;border-bottom:none;padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1f1f22;padding:16px 0;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;color:#3f3f46;font-family:'Courier New',monospace;">
                      SUBMITTED &nbsp;·&nbsp; ${new Date().toUTCString()}
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:11px;color:#3f3f46;font-family:'Courier New',monospace;">
                      REF #${ticket_id}
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
                Auto-generated by Issue Reporter &nbsp;·&nbsp; Do not reply directly to this email
              </p>
            </td>
          </tr>

          <!-- BOTTOM ACCENT BAR -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,transparent,#dc2626,transparent);border-radius:0 0 4px 4px;"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"Issue Reporter" <${process.env.ISSUE_EMAIL}>`,
      to: process.env.ISSUE_EMAIL,
      replyTo: from_email,
      subject: `[#${ticket_id}] ${severity} · ${issue_category} from ${from_name}`,
      html,
    });

    return NextResponse.json({ success: true, ticket_id });
  } catch (err) {
    console.error('[submit-issue]', err);
    return NextResponse.json({ error: 'Failed to send email. Check server logs.' }, { status: 500 });
  }
}