"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Palette,
  BrainCircuit,
  Cloud,
  Github,
  Linkedin,
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import {
  ApplicationFormData,
  ApplicationFormErrors,
  EMPTY_APPLICATION,
  TRACKS,
  Track,
  EXPERIENCE_LEVELS,
  CURRENT_YEAR_OPTIONS,
  JOIN_FROM_OPTIONS,
} from "../../lib/types/application";

const MAX_RESUME_BYTES = 4 * 1024 * 1024; // 4MB — keep in sync with app/api/apply/route.ts
const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
const URL_REGEX = /^https?:\/\/.+/i;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

const TRACK_META: Record<Track, { icon: React.ElementType; blurb: string }> = {
  "Frontend Engineering": { icon: Code2, blurb: "React, Next.js, and building interfaces people enjoy using." },
  "UI/UX Design": { icon: Palette, blurb: "Wireframes, design systems, and making products feel obvious." },
  "AI Engineering": { icon: BrainCircuit, blurb: "LLMs, APIs, and shipping AI features that actually work." },
  "DevOps / Cloud": { icon: Cloud, blurb: "CI/CD, infra, and keeping things running when it matters." },
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ApplicationFormPage() {
  const [form, setForm] = useState<ApplicationFormData>(EMPTY_APPLICATION);
  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<ApplicationFormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleResumeSelect(file: File | null) {
    if (!file) {
      setResume(null);
      return;
    }
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, resume: "Resume must be a PDF file." }));
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setErrors((prev) => ({ ...prev, resume: "Resume must be under 4MB." }));
      return;
    }
    setErrors((prev) => ({ ...prev, resume: undefined }));
    setResume(file);
  }

  function validate(): ApplicationFormErrors {
    const next: ApplicationFormErrors = {};

    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!GMAIL_REGEX.test(form.email.trim())) next.email = "Enter a valid Gmail address (e.g. name@gmail.com).";
    if (!form.track) next.track = "Choose a track to apply for.";
    if (!form.collegeName.trim()) next.collegeName = "College name is required.";
    if (!/^\d{4}$/.test(form.graduationYear.trim())) next.graduationYear = "Enter a 4-digit year, e.g. 2027.";
    if (!form.currentYear) next.currentYear = "Select your current year of study.";
    const cgpaNum = Number(form.cgpa);
    if (!form.cgpa.trim() || Number.isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      next.cgpa = "Enter a valid CGPA between 0 and 10.";
    }
    if (!/^[6-9]\d{9}$/.test(form.contactNumber.trim())) {
      next.contactNumber = "Enter a valid 10-digit contact number.";
    }
    if (form.githubProfile.trim() && !URL_REGEX.test(form.githubProfile.trim())) {
      next.githubProfile = "Enter a valid URL, or leave this blank.";
    }
    if (!URL_REGEX.test(form.linkedinProfile.trim())) next.linkedinProfile = "Enter a valid LinkedIn URL.";
    if (!form.experienceLevel) next.experienceLevel = "Select your experience level.";
    if (!resume) next.resume = "Please attach your resume (PDF, under 4MB).";
    if (!form.project1.trim()) next.project1 = "Describe your first major project.";
    if (!form.project2.trim()) next.project2 = "Describe your second major project.";
    if (!form.whyThisOpportunity.trim()) next.whyThisOpportunity = "Tell us why you want this opportunity.";
    if (!form.aboutCodeNFacts.trim()) next.aboutCodeNFacts = "Tell us what you know about CodeNFacts.";
    if (!form.subscribed) next.subscribed = "Let us know if you've subscribed.";
    if (!form.joinFrom) next.joinFrom = "Select when you can join.";

    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      document.getElementById(firstErrorKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitState("submitting");
    setSubmitError("");

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      if (resume) payload.append("resume", resume);

      const res = await fetch("/api/apply", { method: "POST", body: payload });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (submitState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-[#0a0e14]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-md w-full text-center bg-[#f7f8fa] dark:bg-[#0d1117] border border-amber-600/20 dark:border-emerald-400/20 rounded-xl p-8"
        >
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-amber-600 dark:text-emerald-400" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Application received</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Thanks, {form.fullName.split(" ")[0]}! We've emailed a confirmation to{" "}
            <span className="font-medium text-gray-900 dark:text-gray-200">{form.email}</span>. Our team will
            review your application for the {form.track} track and reach out if you're shortlisted.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e14] px-4 py-10 sm:py-16">
      <form onSubmit={handleSubmit} noValidate className="max-w-2xl mx-auto">
        {/* Terminal-chrome header */}
        <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="mb-8">
          <div className="rounded-t-xl bg-[#f7f8fa] dark:bg-[#0d1117] border border-b-0 border-amber-600/20 dark:border-emerald-400/20 px-4 py-3 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-3 text-xs font-mono text-gray-500 dark:text-gray-500">Application Form</span>
          </div>
          <div className="rounded-b-xl bg-[#f7f8fa] dark:bg-[#0d1117] border border-amber-600/20 dark:border-emerald-400/20 px-6 py-6">
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-gray-900 dark:text-gray-100">
              Apply to CodeNFacts
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Tell us about yourself and pick a track. Applications are reviewed on a rolling basis.
            </p>
          </div>
        </motion.div>

        {/* Track selection */}
        <Section index={1} title="Choose your track" error={errors.track}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRACKS.map((track) => {
              const Meta = TRACK_META[track];
              const Icon = Meta.icon;
              const selected = form.track === track;
              return (
                <button
                  type="button"
                  key={track}
                  id={selected ? undefined : "track"}
                  onClick={() => update("track", track)}
                  className={`text-left rounded-lg border p-4 transition-colors ${
                    selected
                      ? "border-amber-600 dark:border-emerald-400 bg-amber-50 dark:bg-emerald-400/10"
                      : "border-gray-200 dark:border-gray-800 hover:border-amber-600/50 dark:hover:border-emerald-400/50"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 mb-2 ${
                      selected ? "text-amber-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{track}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{Meta.blurb}</div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Personal & academic details */}
        <Section index={2} title="Personal & academic details">
          <FieldGrid>
            <TextField
              id="fullName"
              label="Full name"
              value={form.fullName}
              onChange={(v) => update("fullName", v)}
              error={errors.fullName}
              placeholder="Prakash Kumar"
            />
            <TextField
              id="email"
              label="Gmail address"
              value={form.email}
              onChange={(v) => update("email", v)}
              error={errors.email}
              placeholder="you@gmail.com"
              type="email"
            />
            <TextField
              id="contactNumber"
              label="Contact number"
              value={form.contactNumber}
              onChange={(v) => update("contactNumber", v.replace(/\D/g, "").slice(0, 10))}
              error={errors.contactNumber}
              placeholder="9876543210"
              inputMode="numeric"
            />
            <TextField
              id="collegeName"
              label="College name"
              value={form.collegeName}
              onChange={(v) => update("collegeName", v)}
              error={errors.collegeName}
              placeholder="KIIT University"
            />
            <TextField
              id="graduationYear"
              label="Year of graduation"
              value={form.graduationYear}
              onChange={(v) => update("graduationYear", v.replace(/\D/g, "").slice(0, 4))}
              error={errors.graduationYear}
              placeholder="2027"
              inputMode="numeric"
            />
            <SelectField
              id="currentYear"
              label="Current year of study"
              value={form.currentYear}
              onChange={(v) => update("currentYear", v as ApplicationFormData["currentYear"])}
              error={errors.currentYear}
              options={CURRENT_YEAR_OPTIONS}
            />
            <TextField
              id="cgpa"
              label="Last CGPA"
              value={form.cgpa}
              onChange={(v) => update("cgpa", v)}
              error={errors.cgpa}
              placeholder="8.5"
              inputMode="decimal"
            />
            <SelectField
              id="experienceLevel"
              label="Experience level"
              value={form.experienceLevel}
              onChange={(v) => update("experienceLevel", v as ApplicationFormData["experienceLevel"])}
              error={errors.experienceLevel}
              options={EXPERIENCE_LEVELS}
            />
          </FieldGrid>
        </Section>

        {/* Links */}
        <Section index={3} title="Profiles">
          <div className="space-y-4">
            <TextField
              id="linkedinProfile"
              label="LinkedIn profile link"
              value={form.linkedinProfile}
              onChange={(v) => update("linkedinProfile", v)}
              error={errors.linkedinProfile}
              placeholder="https://linkedin.com/in/yourname"
              icon={Linkedin}
            />
            <TextField
              id="githubProfile"
              label="GitHub profile (optional)"
              value={form.githubProfile}
              onChange={(v) => update("githubProfile", v)}
              error={errors.githubProfile}
              placeholder="https://github.com/yourname"
              icon={Github}
            />
          </div>
        </Section>

        {/* Resume upload */}
        <Section index={4} title="Resume" error={errors.resume}>
          <div id="resume">
            {!resume ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-amber-600 dark:hover:border-emerald-400 transition-colors py-8 flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400"
              >
                <Upload className="h-6 w-6" />
                <span className="text-sm">Click to upload your resume</span>
                <span className="text-xs text-gray-400 dark:text-gray-600">PDF only, up to 4MB</span>
              </button>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-emerald-400" />
                  <span className="text-sm truncate text-gray-900 dark:text-gray-200">{resume.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResume(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-gray-400 hover:text-red-500 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleResumeSelect(e.target.files?.[0] || null)}
            />
          </div>
        </Section>

        {/* Projects */}
        <Section index={5} title="Your top 2 major projects">
          <div className="space-y-4">
            <TextArea
              id="project1"
              label="Project 1"
              value={form.project1}
              onChange={(v) => update("project1", v)}
              error={errors.project1}
              placeholder="What did you build, what stack did you use, and what was the outcome?"
            />
            <TextArea
              id="project2"
              label="Project 2"
              value={form.project2}
              onChange={(v) => update("project2", v)}
              error={errors.project2}
              placeholder="What did you build, what stack did you use, and what was the outcome?"
            />
          </div>
        </Section>

        {/* Motivation */}
        <Section index={6} title="A bit more about you">
          <div className="space-y-4">
            <TextArea
              id="whyThisOpportunity"
              label="Why do you want this opportunity?"
              value={form.whyThisOpportunity}
              onChange={(v) => update("whyThisOpportunity", v)}
              error={errors.whyThisOpportunity}
              placeholder="What are you hoping to learn or achieve from this internship?"
            />
            <TextArea
              id="aboutCodeNFacts"
              label="What do you know about CodeNFacts?"
              value={form.aboutCodeNFacts}
              onChange={(v) => update("aboutCodeNFacts", v)}
              error={errors.aboutCodeNFacts}
              placeholder="Tell us what you know about our platform, content, or community."
            />
          </div>
        </Section>

        {/* Logistics */}
        <Section index={7} title="Logistics">
          <FieldGrid>
            <div id="subscribed">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Have you subscribed to CodeNFacts?
              </label>
              <div className="flex gap-2">
                {(["Yes", "No"] as const).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => update("subscribed", opt)}
                    className={`flex-1 rounded-lg border py-2 text-sm transition-colors ${
                      form.subscribed === opt
                        ? "border-amber-600 dark:border-emerald-400 bg-amber-50 dark:bg-emerald-400/10 text-gray-900 dark:text-gray-100"
                        : "border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {errors.subscribed && <p className="mt-1 text-xs text-red-500">{errors.subscribed}</p>}
            </div>
            <SelectField
              id="joinFrom"
              label="From when can you join?"
              value={form.joinFrom}
              onChange={(v) => update("joinFrom", v as ApplicationFormData["joinFrom"])}
              error={errors.joinFrom}
              options={JOIN_FROM_OPTIONS}
            />
          </FieldGrid>
          <div className="mt-4">
            <TextArea
              id="anythingElse"
              label="Anything else? (optional)"
              value={form.anythingElse}
              onChange={(v) => update("anythingElse", v)}
              placeholder="Anything you'd like us to know."
              rows={3}
            />
          </div>
        </Section>

        {/* Submit */}
        <motion.div initial="hidden" animate="visible" custom={8} variants={fadeUp} className="mt-8">
          {submitState === "error" && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={submitState === "submitting"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 dark:bg-emerald-400 px-6 py-3 text-sm font-medium text-white dark:text-[#0a0e14] hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {submitState === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit application
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}

/* ---------------------------------- Layout helpers ---------------------------------- */

function Section({
  index,
  title,
  error,
  children,
}: {
  index: number;
  title: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} custom={index} variants={fadeUp} className="mb-6">
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1117] p-5 sm:p-6">
        <h2 className="text-sm font-semibold font-mono text-gray-900 dark:text-gray-100 mb-4">{title}</h2>
        {children}
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>
    </motion.div>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

/* ---------------------------------- Field primitives ---------------------------------- */

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  inputMode,
  icon: Icon,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  icon?: React.ElementType;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600/40 dark:focus:ring-emerald-400/40 ${
            Icon ? "pl-9" : ""
          } ${error ? "border-red-500" : "border-gray-200 dark:border-gray-800"}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function TextArea({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full rounded-lg border bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600/40 dark:focus:ring-emerald-400/40 resize-none ${
          error ? "border-red-500" : "border-gray-200 dark:border-gray-800"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SelectField<T extends string>({
  id,
  label,
  value,
  onChange,
  error,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  options: readonly T[];
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-600/40 dark:focus:ring-emerald-400/40 ${
          error ? "border-red-500" : "border-gray-200 dark:border-gray-800"
        }`}
      >
        <option value="" disabled className="text-gray-400">
          Select...
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-white dark:bg-[#0d1117]">
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}