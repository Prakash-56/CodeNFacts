import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email, fullName } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"CodeNFacts" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome to CodeNFacts 🎉",
      html: `
        <div style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                  
                  <tr>
                    <td style="background:#111827;padding:32px;text-align:center;">
                      <h1 style="margin:0;color:#ffffff;font-size:30px;">
                        Welcome to CodeNFacts 🚀
                      </h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:40px 32px;color:#374151;">
                      <h2 style="margin-top:0;color:#111827;">
                        Hi ${fullName || "Learner"} 👋,
                      </h2>

                      <p style="font-size:16px;line-height:1.8;margin-bottom:20px;">
                        Thank you for joining <strong>CodeNFacts</strong>! We're excited
                        to have you as part of our growing learning community.
                      </p>

                      <p style="font-size:16px;line-height:1.8;margin-bottom:20px;">
                        We hope your journey is filled with new skills, exciting
                        projects, and continuous growth. Every expert was once a
                        beginner, and today is the perfect day to take the next step.
                      </p>

                      <p style="font-size:16px;line-height:1.8;">
                        Wishing you success and happy learning!
                      </p>

                      <p style="margin-top:36px;">
                        Best wishes,<br/>
                        <strong>Team CodeNFacts</strong>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:20px;background:#f9fafb;text-align:center;color:#6b7280;font-size:13px;">
                      © ${new Date().getFullYear()} CodeNFacts. All rights reserved.
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Email send error:", err);

    return NextResponse.json(
      {
        error: err.message || "Failed to send email",
      },
      {
        status: 500,
      }
    );
  }
}