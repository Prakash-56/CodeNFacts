"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type Status = "idle" | "loading" | "success" | "error";

export default function FeedbackPage() {
  const { user } = useAuth();

  const [form, setForm] = useState<FormState>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address";
    }
    if (!form.phone.trim()) {
      next.phone = "Contact number is required";
    } else if (!/^[+]?[\d\s-]{8,15}$/.test(form.phone.trim())) {
      next.phone = "Enter a valid contact number";
    }
    if (!form.subject.trim()) next.subject = "Subject is required";
    if (!form.message.trim()) {
      next.message = "Message is required";
    } else if (form.message.trim().length < 10) {
      next.message = "Please write at least 10 characters";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setForm({
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to send feedback");
    }
  };

  if (status === "success") {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/40">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Thank you for your feedback!</h1>
          <p className="text-sm text-gray-500 mb-1">
            We&apos;ve received your message and sent a confirmation to your email.
          </p>
          <p className="text-sm font-medium text-green-600 mb-6">
            Keep coding, keep creating.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setStatus("idle")}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--card)] transition"
            >
              Send another
            </button>
            <Link
              href="/profile"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition text-center"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10 md:py-14">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/40">
          <MessageSquare className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Send Feedback</h1>
        <p className="mt-2 text-sm text-gray-500">
          Suggestions, ideas - we read every message. All fields are required.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-5"
        noValidate
      >
        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            className={`input ${errors.name ? "border-red-500" : ""}`}
            disabled={status === "loading"}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email (Gmail) <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@gmail.com"
            className={`input ${errors.email ? "border-red-500" : ""}`}
            disabled={status === "loading"}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={`input ${errors.phone ? "border-red-500" : ""}`}
            disabled={status === "loading"}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className={`input ${errors.subject ? "border-red-500" : ""}`}
            disabled={status === "loading"}
          >
            <option value="">Select a subject</option>
            <option value="Suggestion">Suggestion / Feature request</option>
            <option value="Bug">Bug report</option>
            <option value="Community">Community section idea</option>
            <option value="Jobs">Jobs / Placement related</option>
            <option value="Other">Other</option>
          </select>
          {errors.subject && (
            <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
            Your Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            placeholder="Tell us what you think, what you'd like to see, or any issue you faced..."
            className={`input resize-none ${errors.message ? "border-red-500" : ""}`}
            disabled={status === "loading"}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-500">{errors.message}</p>
          )}
        </div>

        {/* Error banner */}
        {status === "error" && (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-60"
        >
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Submit Feedback
            </>
          )}
        </button>
      </form>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: transparent;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus {
          border-color: #22c55e;
        }
        .input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </main>
  );
}