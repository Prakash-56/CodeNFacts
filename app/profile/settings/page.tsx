"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, Plus, X, Mail, CheckCircle2 } from "lucide-react";

type SettingsTab = "userhandle" | "emails" | "ads" | "notifications";

const TABS: { key: SettingsTab; label: string }[] = [
  { key: "userhandle", label: "Change Userhandle" },
  { key: "emails", label: "User Emails" },
  { key: "ads", label: "Personalized Ads" },
  { key: "notifications", label: "Notifications" },
];

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("userhandle");

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:py-10">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] hover:underline"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Tabs */}
      <div className="mt-5 flex gap-6 border-b border-[var(--border)] text-sm font-medium overflow-x-auto whitespace-nowrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 transition ${
              activeTab === tab.key
                ? "border-b-2 border-green-600 text-[var(--foreground)]"
                : "text-gray-500 hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === "userhandle" && <ChangeUserhandleTab />}
        {activeTab === "emails" && <UserEmailsTab />}
        {activeTab === "ads" && <PersonalizedAdsTab />}
        {activeTab === "notifications" && <NotificationsTab />}
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: transparent;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #3b82f6;
        }
      `}</style>
    </main>
  );
}

// ───────────────────────────────────────────────
// Change Userhandle
// ───────────────────────────────────────────────

function ChangeUserhandleTab() {
  const { user } = useAuth();

  // TODO: seed this from the user's real current handle, fetched from your backend.
  const [handle, setHandle] = useState(
    user?.email ? user.email.split("@")[0] + Math.floor(Math.random() * 9999) : ""
  );
  const [updateLimitRemaining] = useState(1); // TODO: fetch real remaining-updates count
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const MAX_LENGTH = 40;

  const handleChange = (value: string) => {
    // Only alphanumeric, max 40 chars
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").slice(0, MAX_LENGTH);
    setHandle(cleaned);
    setError("");
    setSuccess(false);
  };

  const handleUpdate = async () => {
    if (!handle.trim()) {
      setError("Userhandle cannot be empty.");
      return;
    }
    if (updateLimitRemaining <= 0) {
      setError("You've used up your userhandle update limit.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // TODO: call your backend to persist the new handle, e.g.
      // await updateUserHandle(handle);
      await new Promise((r) => setTimeout(r, 600));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    }

    setSaving(false);
  };

  return (
    <div className="max-w-md">
      <p className="text-sm font-medium text-orange-500">
        Userhandle update limit remaining: {updateLimitRemaining}
      </p>

      <p className="mt-4 text-sm italic text-gray-500">
        (Max {MAX_LENGTH} character, only alphanumeric allowed)
      </p>

      <div className="mt-2 flex gap-3">
        <input
          value={handle}
          onChange={(e) => handleChange(e.target.value)}
          maxLength={MAX_LENGTH}
          className="input"
          placeholder="your-handle"
        />
        <button
          onClick={handleUpdate}
          disabled={saving || updateLimitRemaining <= 0}
          className="shrink-0 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      {success && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-green-600">
          <CheckCircle2 size={14} /> Userhandle updated successfully.
        </p>
      )}

      <p className="mt-6 text-sm italic text-gray-500">
        Note: We use caching at many places and the changes to your handle may
        take up to 48 hours to reflect everywhere.
      </p>
    </div>
  );
}

// ───────────────────────────────────────────────
// User Emails
// ───────────────────────────────────────────────

function UserEmailsTab() {
  const { user } = useAuth();

  // TODO: fetch the user's actual email list (primary + any secondary/backup emails) from backend.
  const [emails] = useState<{ email: string; primary: boolean; verified: boolean }[]>(
    user?.email ? [{ email: user.email, primary: true, verified: true }] : []
  );

  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const handleAddEmail = async () => {
    if (!/^\S+@\S+\.\S+$/.test(newEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setAdding(true);
    setError("");
    try {
      // TODO: call backend to send a verification link to `newEmail`
      await new Promise((r) => setTimeout(r, 600));
      setNewEmail("");
    } catch (err: any) {
      setError(err.message ?? "Failed to add email.");
    }
    setAdding(false);
  };

  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-3">
        {emails.map((e) => (
          <div
            key={e.email}
            className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3"
          >
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium">{e.email}</p>
                <p className="text-xs text-gray-500">
                  {e.primary ? "Primary" : "Secondary"}
                  {e.verified ? " · Verified" : " · Not verified"}
                </p>
              </div>
            </div>
            {e.verified && <CheckCircle2 size={16} className="text-green-600" />}
          </div>
        ))}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Add another email</label>
        <div className="flex gap-3">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="you@example.com"
            className="input"
          />
          <button
            onClick={handleAddEmail}
            disabled={adding}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold hover:bg-[var(--card)] disabled:opacity-50"
          >
            <Plus size={15} />
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <p className="mt-2 text-xs text-gray-500">
          We'll send a verification link to confirm any new email address.
        </p>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Personalized Ads
// ───────────────────────────────────────────────

function PersonalizedAdsTab() {
  const [personalizedAds, setPersonalizedAds] = useState(true);

  return (
    <div className="max-w-md space-y-5">
      <ToggleRow
        title="Personalized Ads"
        description="Allow us to use your activity on CodeNFacts to show you more relevant ads."
        checked={personalizedAds}
        onChange={setPersonalizedAds}
      />
      <p className="text-xs text-gray-500">
        Turning this off won't reduce the number of ads you see, but the ads
        may be less relevant to you. This setting doesn't affect ads shown by
        third-party platforms outside CodeNFacts.
      </p>
    </div>
  );
}

// ───────────────────────────────────────────────
// Notifications
// ───────────────────────────────────────────────

function NotificationsTab() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  const [newCourseAlerts, setNewCourseAlerts] = useState(true);
  const [mentionAlerts, setMentionAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="max-w-md space-y-5">
      <ToggleRow
        title="Email Notifications"
        description="Receive notifications about your account via email."
        checked={emailNotifs}
        onChange={setEmailNotifs}
      />
      <ToggleRow
        title="Product Updates"
        description="Get notified when we ship new features or improvements."
        checked={productUpdates}
        onChange={setProductUpdates}
      />
      <ToggleRow
        title="New Course Alerts"
        description="Be the first to know when a new course or tutorial goes live."
        checked={newCourseAlerts}
        onChange={setNewCourseAlerts}
      />
      <ToggleRow
        title="Mentions & Replies"
        description="Get notified when someone mentions or replies to you."
        checked={mentionAlerts}
        onChange={setMentionAlerts}
      />
      <ToggleRow
        title="Marketing Emails"
        description="Occasional emails about offers, events, and promotions."
        checked={marketingEmails}
        onChange={setMarketingEmails}
      />
    </div>
  );
}

// ───────────────────────────────────────────────
// Shared toggle row
// ───────────────────────────────────────────────

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-[var(--border)] px-4 py-3.5">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-green-600" : "bg-gray-300 dark:bg-gray-700"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}