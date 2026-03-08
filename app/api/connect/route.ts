/*app/api/connect/route.ts*/
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/* ── Rate-limit: simple in-memory (per deployment instance) ────────────────── */
const rateMap = new Map<string, number[]>();
const RATE_LIMIT = 3;          // max submissions
const RATE_WINDOW = 60 * 1000; // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateMap.get(ip) ?? []).filter(t => now - t < RATE_WINDOW);
  if (hits.length >= RATE_LIMIT) return true;
  hits.push(now);
  rateMap.set(ip, hits);
  return false;
}

/* ── Transporter ────────────────────────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false, // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ── POST handler ───────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  /* Rate limit */
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  /* Parse body */
  let name: string, email: string, question: string;
  try {
    ({ name, email, question } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  /* Validate */
  if (
    !name?.trim() ||
    !email?.trim() ||
    !question?.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json({ error: "All fields are required and email must be valid." }, { status: 422 });
  }

  /* Sanitize (basic XSS strip) */
  const clean = (s: string) => s.replace(/<[^>]*>/g, "").trim().slice(0, 2000);
  const safeName = clean(name);
  const safeEmail = clean(email);
  const safeQuestion = clean(question);

  /* Send mail */
  try {
    // ── Admin notification ──────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"${safeName}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      replyTo: safeEmail,
      subject: `✦ New Question from ${safeName}`,
      text: [
        `Name: ${safeName}`,
        `Email: ${safeEmail}`,
        ``,
        `Question:`,
        safeQuestion,
      ].join("\n"),
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>New Question</title>
        </head>
        <body style="margin:0;padding:0;background:#0d0b09;font-family:'Georgia',serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0b09;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#110f0c;border:1px solid #2a2520;border-radius:4px;overflow:hidden;">

                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#c9a96e,#8b6914);padding:32px 40px;">
                      <p style="margin:0;color:#0d0b09;font-family:'Arial',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;font-weight:700;">✦ Atelier Support</p>
                      <h1 style="margin:8px 0 0;color:#0d0b09;font-size:28px;letter-spacing:-0.03em;font-weight:800;">New Question</h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">

                      <!-- Meta -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                        <tr>
                          <td style="padding:12px 0;border-bottom:1px solid #2a2520;">
                            <span style="font-size:9px;letter-spacing:3px;color:#4a4540;text-transform:uppercase;font-family:'Arial',sans-serif;display:block;margin-bottom:6px;">From</span>
                            <span style="color:#e8e0d5;font-size:16px;">${safeName}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:12px 0;border-bottom:1px solid #2a2520;">
                            <span style="font-size:9px;letter-spacing:3px;color:#4a4540;text-transform:uppercase;font-family:'Arial',sans-serif;display:block;margin-bottom:6px;">Reply-To</span>
                            <a href="mailto:${safeEmail}" style="color:#c9a96e;font-size:16px;text-decoration:none;">${safeEmail}</a>
                          </td>
                        </tr>
                      </table>

                      <!-- Question -->
                      <p style="font-size:9px;letter-spacing:3px;color:#4a4540;text-transform:uppercase;font-family:'Arial',sans-serif;margin:0 0 14px;">Question</p>
                      <div style="background:#0d0b09;border-left:2px solid #c9a96e;padding:20px 24px;border-radius:2px;">
                        <p style="margin:0;color:#e8e0d5;font-size:15px;line-height:1.75;white-space:pre-wrap;">${safeQuestion}</p>
                      </div>

                      <!-- CTA -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                        <tr>
                          <td align="center">
                            <a href="mailto:${safeEmail}?subject=Re: Your question"
                               style="display:inline-block;background:linear-gradient(135deg,#c9a96e,#8b6914);color:#0d0b09;text-decoration:none;padding:14px 36px;font-family:'Arial',sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;border-radius:2px;">
                              Reply Now
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:24px 40px;border-top:1px solid #2a2520;">
                      <p style="margin:0;font-size:10px;color:#3a3530;font-family:'Arial',sans-serif;letter-spacing:2px;text-align:center;text-transform:uppercase;">Transmitted via Have A Question™ · Encrypted · Never Shared</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    // ── User confirmation ───────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"Atelier Support" <${process.env.SMTP_USER}>`,
      to: safeEmail,
      subject: `✦ We received your question, ${safeName}`,
      text: [
        `Hi ${safeName},`,
        ``,
        `Thank you for reaching out. We've received your question and will get back to you shortly.`,
        ``,
        `Your question:`,
        safeQuestion,
        ``,
        `⁓ Atelier Support`,
      ].join("\n"),
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>We received your question</title>
        </head>
        <body style="margin:0;padding:0;background:#0d0b09;font-family:'Georgia',serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0b09;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#110f0c;border:1px solid #2a2520;border-radius:4px;overflow:hidden;">

                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#c9a96e,#8b6914);padding:32px 40px;">
                      <p style="margin:0;color:#0d0b09;font-family:'Arial',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;font-weight:700;">✦ Atelier Support</p>
                      <h1 style="margin:8px 0 0;color:#0d0b09;font-size:28px;letter-spacing:-0.03em;font-weight:800;">We're on it.</h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <p style="margin:0 0 24px;color:#e8e0d5;font-size:16px;line-height:1.7;">
                        Hi <strong style="color:#c9a96e;">${safeName}</strong>,<br/><br/>
                        Thank you for reaching out. We've received your question and will get back to you as soon as possible.
                      </p>

                      <!-- Question echo -->
                      <p style="font-size:9px;letter-spacing:3px;color:#4a4540;text-transform:uppercase;font-family:'Arial',sans-serif;margin:0 0 14px;">Your Question</p>
                      <div style="background:#0d0b09;border-left:2px solid #c9a96e;padding:20px 24px;border-radius:2px;margin-bottom:32px;">
                        <p style="margin:0;color:#e8e0d5;font-size:15px;line-height:1.75;white-space:pre-wrap;">${safeQuestion}</p>
                      </div>

                      <p style="margin:0;color:#6a6460;font-size:13px;line-height:1.6;">
                        If you didn't submit this question, please disregard this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:24px 40px;border-top:1px solid #2a2520;">
                      <p style="margin:0;font-size:10px;color:#3a3530;font-family:'Arial',sans-serif;letter-spacing:2px;text-align:center;text-transform:uppercase;">Atelier Support™ · Encrypted · Never Shared</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[contact] sendMail error:", err);
    return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
  }
}