// app/api/apply/route.ts
// Handles submissions from app/apply/page.tsx.
//
// ENV VARS REQUIRED (.env.local):
//   GMAIL_USER               - same Gmail account already used by the contact route
//   GMAIL_APP_PASSWORD       - Gmail App Password (not your normal password)
//   APPLICATION_RECEIVER_EMAIL - the inbox that should get a copy of every application
//                                 (falls back to CONTACT_RECEIVER_EMAIL, then GMAIL_USER)
//
// NOTE ON HOSTING: if you deploy on Vercel, serverless Route Handlers have a
// request body limit (4.5MB on Hobby/Pro). The client already blocks resumes
// over 4MB before it even calls this route, so you shouldn't hit that ceiling,
// but raise MAX_RESUME_BYTES here and on the client together if you ever change it.

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const MAX_RESUME_BYTES = 4 * 1024 * 1024; // 4MB
const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
const URL_REGEX = /^https?:\/\/.+/i;

// ---- TODO(backend): swap this in-memory limiter for Redis/Firestore in production ----
// Same pattern as the contact route: fine for a single instance, resets on redeploy,
// and won't share state across multiple serverless instances.
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // max 3 applications per IP per hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.firstRequest > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count += 1;
  return false;
}

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface ParsedFields {
  fullName: string;
  email: string;
  track: string;
  collegeName: string;
  graduationYear: string;
  currentYear: string;
  cgpa: string;
  contactNumber: string;
  githubProfile: string;
  linkedinProfile: string;
  experienceLevel: string;
  project1: string;
  project2: string;
  whyThisOpportunity: string;
  aboutCodeNFacts: string;
  subscribed: string;
  joinFrom: string;
  anythingElse: string;
}

const REQUIRED_TEXT_FIELDS: (keyof ParsedFields)[] = [
  "fullName",
  "email",
  "track",
  "collegeName",
  "graduationYear",
  "currentYear",
  "cgpa",
  "contactNumber",
  "linkedinProfile",
  "experienceLevel",
  "project1",
  "project2",
  "whyThisOpportunity",
  "aboutCodeNFacts",
  "subscribed",
  "joinFrom",
];

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many applications from this device. Please try again in an hour." },
        { status: 429 }
      );
    }

    const formData = await req.formData();

    const fields: ParsedFields = {
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      track: String(formData.get("track") || "").trim(),
      collegeName: String(formData.get("collegeName") || "").trim(),
      graduationYear: String(formData.get("graduationYear") || "").trim(),
      currentYear: String(formData.get("currentYear") || "").trim(),
      cgpa: String(formData.get("cgpa") || "").trim(),
      contactNumber: String(formData.get("contactNumber") || "").trim(),
      githubProfile: String(formData.get("githubProfile") || "").trim(),
      linkedinProfile: String(formData.get("linkedinProfile") || "").trim(),
      experienceLevel: String(formData.get("experienceLevel") || "").trim(),
      project1: String(formData.get("project1") || "").trim(),
      project2: String(formData.get("project2") || "").trim(),
      whyThisOpportunity: String(formData.get("whyThisOpportunity") || "").trim(),
      aboutCodeNFacts: String(formData.get("aboutCodeNFacts") || "").trim(),
      subscribed: String(formData.get("subscribed") || "").trim(),
      joinFrom: String(formData.get("joinFrom") || "").trim(),
      anythingElse: String(formData.get("anythingElse") || "").trim(),
    };

    const resume = formData.get("resume");

    // ---- validation ----
    for (const key of REQUIRED_TEXT_FIELDS) {
      if (!fields[key]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${key}` }, { status: 400 });
      }
    }

    if (!GMAIL_REGEX.test(fields.email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid Gmail address." },
        { status: 400 }
      );
    }

    if (!URL_REGEX.test(fields.linkedinProfile)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid LinkedIn profile URL." },
        { status: 400 }
      );
    }

    if (fields.githubProfile && !URL_REGEX.test(fields.githubProfile)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid GitHub profile URL, or leave it blank." },
        { status: 400 }
      );
    }

    const cgpaNum = Number(fields.cgpa);
    if (Number.isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      return NextResponse.json(
        { success: false, error: "CGPA must be a number between 0 and 10." },
        { status: 400 }
      );
    }

    if (!(resume instanceof Blob) || resume.size === 0) {
      return NextResponse.json({ success: false, error: "Please attach your resume." }, { status: 400 });
    }

    if (resume.type !== "application/pdf") {
      return NextResponse.json({ success: false, error: "Resume must be a PDF file." }, { status: 400 });
    }

    if (resume.size > MAX_RESUME_BYTES) {
      return NextResponse.json(
        { success: false, error: "Resume must be under 4MB." },
        { status: 400 }
      );
    }

    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    const resumeFilename = `${fields.fullName.replace(/[^a-zA-Z0-9]+/g, "_")}_Resume.pdf`;

    // ---- transporter ----
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const adminReceiver =
      process.env.APPLICATION_RECEIVER_EMAIL ||
      process.env.CONTACT_RECEIVER_EMAIL ||
      process.env.GMAIL_USER;

    const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const detailRows: [string, string][] = [
      ["Track", fields.track],
      ["Full Name", fields.fullName],
      ["Gmail", fields.email],
      ["Contact Number", fields.contactNumber],
      ["College", fields.collegeName],
      ["Year of Graduation", fields.graduationYear],
      ["Current Year of Study", fields.currentYear],
      ["Last CGPA", fields.cgpa],
      ["Experience Level", fields.experienceLevel],
      ["GitHub", fields.githubProfile || "Not provided"],
      ["LinkedIn", fields.linkedinProfile],
      ["Already Subscribed to CodeNFacts", fields.subscribed],
      ["Can Join From", fields.joinFrom],
    ];

    const adminHtml = `
      <div style="font-family: 'JetBrains Mono', monospace; max-width: 640px; margin: 0 auto; background:#0d1117; color:#e6edf3; padding:24px; border-radius:8px;">
        <div style="display:flex; gap:6px; margin-bottom:16px;">
          <span style="width:10px;height:10px;border-radius:50%;background:#ff5f56;display:inline-block;"></span>
          <span style="width:10px;height:10px;border-radius:50%;background:#ffbd2e;display:inline-block;"></span>
          <span style="width:10px;height:10px;border-radius:50%;background:#27c93f;display:inline-block;"></span>
        </div>
        <h2 style="color:#34d399; margin:0 0 4px 0;">New Internship Application</h2>
        <p style="color:#8b949e; margin:0 0 20px 0; font-size:13px;">Submitted ${escapeHtml(submittedAt)} IST</p>
        <table style="width:100%; border-collapse: collapse; font-size:14px;">
          ${detailRows
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding:6px 10px 6px 0; color:#8b949e; vertical-align:top; white-space:nowrap;">${escapeHtml(label)}</td>
              <td style="padding:6px 0; color:#e6edf3;">${escapeHtml(value)}</td>
            </tr>`
            )
            .join("")}
        </table>
        <hr style="border:none; border-top:1px solid #21262d; margin:20px 0;" />
        <h3 style="color:#34d399; font-size:14px; margin-bottom:4px;">Top Project 1</h3>
        <p style="white-space:pre-wrap; color:#e6edf3; font-size:13px;">${escapeHtml(fields.project1)}</p>
        <h3 style="color:#34d399; font-size:14px; margin-bottom:4px;">Top Project 2</h3>
        <p style="white-space:pre-wrap; color:#e6edf3; font-size:13px;">${escapeHtml(fields.project2)}</p>
        <h3 style="color:#34d399; font-size:14px; margin-bottom:4px;">Why this opportunity</h3>
        <p style="white-space:pre-wrap; color:#e6edf3; font-size:13px;">${escapeHtml(fields.whyThisOpportunity)}</p>
        <h3 style="color:#34d399; font-size:14px; margin-bottom:4px;">What they know about CodeNFacts</h3>
        <p style="white-space:pre-wrap; color:#e6edf3; font-size:13px;">${escapeHtml(fields.aboutCodeNFacts)}</p>
        ${
          fields.anythingElse
            ? `<h3 style="color:#34d399; font-size:14px; margin-bottom:4px;">Anything else</h3>
               <p style="white-space:pre-wrap; color:#e6edf3; font-size:13px;">${escapeHtml(fields.anythingElse)}</p>`
            : ""
        }
      </div>
    `;

    const applicantHtml = `
      <div style="font-family: 'JetBrains Mono', monospace; max-width: 560px; margin: 0 auto; background:#0d1117; color:#e6edf3; padding:24px; border-radius:8px;">
        <div style="display:flex; gap:6px; margin-bottom:16px;">
          <span style="width:10px;height:10px;border-radius:50%;background:#ff5f56;display:inline-block;"></span>
          <span style="width:10px;height:10px;border-radius:50%;background:#ffbd2e;display:inline-block;"></span>
          <span style="width:10px;height:10px;border-radius:50%;background:#27c93f;display:inline-block;"></span>
        </div>
        <h2 style="color:#34d399; margin:0 0 12px 0;">We've received your application, ${escapeHtml(fields.fullName.split(" ")[0])}!</h2>
        <p style="font-size:14px; line-height:1.6; color:#c9d1d9;">
          Thanks for applying to the <strong style="color:#e6edf3;">${escapeHtml(fields.track)}</strong> track at CodeNFacts.
          Your application has been logged and our team will review it shortly. If you're shortlisted,
          we'll reach out at this email (${escapeHtml(fields.email)}) or your contact number.
        </p>
        <p style="font-size:14px; line-height:1.6; color:#c9d1d9;">
          You mentioned you can join from: <strong style="color:#34d399;">${escapeHtml(fields.joinFrom)}</strong>.
        </p>
        <p style="font-size:13px; color:#8b949e; margin-top:24px;">— Team CodeNFacts</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"CodeNFacts Applications" <${process.env.GMAIL_USER}>`,
      to: adminReceiver,
      replyTo: fields.email,
      subject: `New Application: ${fields.track} — ${fields.fullName}`,
      html: adminHtml,
      attachments: [
        {
          filename: resumeFilename,
          content: resumeBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    await transporter.sendMail({
      from: `"CodeNFacts" <${process.env.GMAIL_USER}>`,
      to: fields.email,
      subject: `CodeNFacts — Application Received (${fields.track})`,
      html: applicantHtml,
    });

    return NextResponse.json({ success: true, message: "Application submitted successfully." });
  } catch (error) {
    console.error("[/api/apply] error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong while submitting your application. Please try again." },
      { status: 500 }
    );
  }
}