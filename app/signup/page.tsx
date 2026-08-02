"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  User,
  Mail,
  Lock,
  Building2,
  Eye,
  EyeOff,
  Github,
  X,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";

import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

import {
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";

// =====================================================
// Validation helpers
// =====================================================

// Only lowercase letters, numbers, underscore, and dot. No spaces, no caps.
const USERNAME_REGEX = /^[a-z0-9_.]+$/;

// Standard email shape check
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Min 6 chars, at least 1 lowercase, 1 uppercase, 1 number, 1 special char
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

function validateUsernameFormat(value: string): string {
  if (!value) return "Username is required.";
  if (/\s/.test(value)) return "Username cannot contain spaces.";
  if (/[A-Z]/.test(value))
    return "Username cannot contain capital letters.";
  if (!USERNAME_REGEX.test(value))
    return "Only lowercase letters, numbers, '_' and '.' are allowed.";
  if (value.length < 3) return "Username must be at least 3 characters.";
  return "";
}

function validateEmailFormat(value: string): string {
  if (!value) return "Email is required.";
  if (!EMAIL_REGEX.test(value)) return "Enter a valid email address.";

  const domain = value.split("@")[1]?.toLowerCase() || "";

  // If it "looks like" a gmail address but isn't exactly @gmail.com,
  // treat it as an invalid gmail. Custom (non-gmail) emails are fine.
  if (domain.includes("gmail") && domain !== "gmail.com") {
    return "Invalid Gmail address. It must be exactly '@gmail.com'.";
  }

  return "";
}

function validatePasswordFormat(value: string): string {
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  if (!/[a-z]/.test(value))
    return "Password must include a lowercase letter.";
  if (!/[A-Z]/.test(value))
    return "Password must include an uppercase letter.";
  if (!/\d/.test(value)) return "Password must include a number.";
  if (!/[^A-Za-z0-9]/.test(value))
    return "Password must include a special character.";
  return "";
}

// Sanitize free-typed input into the allowed username charset live
function sanitizeUsernameInput(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_.]/g, "");
}

// Build a base slug from full name, e.g. "Prakash Behera" -> "prakash.behera"
function slugifyFullName(fullName: string): string {
  return fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .join(".");
}

// Generate a pool of candidate usernames based on the full name and
// CodeNFacts "code vibe" naming style.
function generateUsernameSuggestions(
  fullName: string,
  attemptedUsername: string
): string[] {
  const base =
    slugifyFullName(fullName) ||
    attemptedUsername.replace(/[^a-z0-9_.]/g, "") ||
    "coder";

  const firstPart = base.split(".")[0] || base;

  const codeVibeSuffixes = [
    "_dev",
    "_codes",
    ".dev",
    "_cnf",
    "_byte",
    "_coder",
    ".codes",
    "_hex",
    "_compiles",
  ];

  const numberSuffixes = ["07", "21", "42", "99", "01"];

  const candidates = new Set<string>();

  candidates.add(base);
  candidates.add(firstPart);

  for (const suffix of codeVibeSuffixes) {
    candidates.add(`${firstPart}${suffix}`);
  }

  for (const num of numberSuffixes) {
    candidates.add(`${firstPart}${num}`);
    candidates.add(`${firstPart}_${num}`);
  }

  // Remove anything that doesn't satisfy our own format rules and the
  // exact attempted username (since that's the one we know is taken)
  return Array.from(candidates)
    .filter((c) => USERNAME_REGEX.test(c) && c.length >= 3)
    .filter((c) => c !== attemptedUsername)
    .slice(0, 6);
}

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [institution, setInstitution] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // Field-level errors
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Username availability state
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>(
    []
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // =====================================
  // Helper: fire-and-forget welcome email
  // =====================================

  const sendWelcomeEmail = async (toEmail: string, name: string) => {
    try {
      await fetch("/api/send-welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: toEmail, fullName: name }),
      });
    } catch (err) {
      console.error("Welcome email failed:", err);
      // Non-blocking — signup should still succeed even if email fails
    }
  };

  // =====================================
  // Username: format validation + live availability check
  // =====================================

  const checkUsernameAvailability = useCallback(
    async (value: string) => {
      const formatError = validateUsernameFormat(value);

      if (formatError) {
        setUsernameError(formatError);
        setUsernameTaken(false);
        setUsernameAvailable(false);
        setUsernameSuggestions([]);
        return;
      }

      setUsernameError("");
      setCheckingUsername(true);

      try {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("username", "==", value),
          limit(1)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          setUsernameTaken(true);
          setUsernameAvailable(false);
          setUsernameSuggestions(
            generateUsernameSuggestions(fullName, value)
          );
        } else {
          setUsernameTaken(false);
          setUsernameAvailable(true);
          setUsernameSuggestions([]);
        }
      } catch (err) {
        console.error("Username check failed:", err);
        // Fail open on availability check so signup isn't blocked by
        // a transient Firestore/network issue — server-side createDoc
        // logic should still guard against true duplicates.
        setUsernameTaken(false);
        setUsernameAvailable(false);
        setUsernameSuggestions([]);
      }

      setCheckingUsername(false);
    },
    [fullName]
  );

  const handleUsernameChange = (raw: string) => {
    const cleaned = sanitizeUsernameInput(raw);
    setUsername(cleaned);
    setUsernameTaken(false);
    setUsernameAvailable(false);
    setUsernameSuggestions([]);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      checkUsernameAvailability(cleaned);
    }, 450);
  };

  const handlePickSuggestion = (suggestion: string) => {
    setUsername(suggestion);
    setUsernameTaken(false);
    setUsernameAvailable(false);
    setUsernameSuggestions([]);
    checkUsernameAvailability(suggestion);
  };

  // =====================================
  // Email / Password live validation
  // =====================================

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(value ? validateEmailFormat(value) : "");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(value ? validatePasswordFormat(value) : "");

    if (confirmPassword) {
      setConfirmPasswordError(
        confirmPassword !== value ? "Passwords do not match." : ""
      );
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setConfirmPasswordError(
      value && value !== password ? "Passwords do not match." : ""
    );
  };

  // =====================================
  // Email Signup
  // =====================================

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    // Re-run full validation on submit, in case the user never blurred a field
    const usernameFormatError = validateUsernameFormat(username);
    const emailFormatError = validateEmailFormat(email);
    const passwordFormatError = validatePasswordFormat(password);

    setUsernameError(usernameFormatError);
    setEmailError(emailFormatError);
    setPasswordError(passwordFormatError);

    if (usernameFormatError || emailFormatError || passwordFormatError) {
      setError("Please fix the highlighted fields before continuing.");
      return;
    }

    if (usernameTaken) {
      setError("That username is already taken. Pick a suggestion below.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Final, authoritative availability check right before creating the account
    try {
      const usersRef = collection(db, "users");
      const dupeQuery = query(
        usersRef,
        where("username", "==", username),
        limit(1)
      );
      const dupeSnapshot = await getDocs(dupeQuery);

      if (!dupeSnapshot.empty) {
        setUsernameTaken(true);
        setUsernameSuggestions(generateUsernameSuggestions(fullName, username));
        setError("That username was just taken. Please choose another.");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Final username check failed:", err);
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        fullName,
        username,
        institution,
        email,
        provider: "email",
        role: "student",
        emailVerified: false,
        createdAt: serverTimestamp(),
      });

      // Our custom greeting email via Gmail SMTP
      await sendWelcomeEmail(email, fullName);

      // Let the app-wide auth context know someone is now signed in,
      // so Header (and anything else using useAuth()) updates immediately.
      login({ name: fullName, email });

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  // =====================================
  // Google Signup
  // =====================================

  const handleGoogleSignup = async () => {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      await setDoc(
        doc(db, "users", result.user.uid),
        {
          uid: result.user.uid,
          fullName: result.user.displayName,
          username: "",
          institution: "",
          email: result.user.email,
          photoURL: result.user.photoURL,
          provider: "google",
          role: "student",
          emailVerified: result.user.emailVerified,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      await sendWelcomeEmail(
        result.user.email || "",
        result.user.displayName || ""
      );

      login({
        name: result.user.displayName || "",
        email: result.user.email || "",
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  // =====================================
  // Github Signup
  // =====================================

  const handleGithubSignup = async () => {
    setLoading(true);

    try {
      const provider = new GithubAuthProvider();

      const result = await signInWithPopup(auth, provider);

      await setDoc(
        doc(db, "users", result.user.uid),
        {
          uid: result.user.uid,
          fullName: result.user.displayName,
          username: "",
          institution: "",
          email: result.user.email,
          photoURL: result.user.photoURL,
          provider: "github",
          role: "student",
          emailVerified: result.user.emailVerified,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (result.user.email) {
        await sendWelcomeEmail(result.user.email, result.user.displayName || "");
      }

      login({
        name: result.user.displayName || "",
        email: result.user.email || "",
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10 bg-gradient-to-br from-slate-100 via-white to-blue-100 dark:from-[#08111F] dark:via-[#111827] dark:to-[#1E293B]">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-blue-600">
            CodeNFacts
          </Link>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Create your account and start learning.
          </p>
        </div>

        {/* Card */}
        <div className="relative rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl p-8">
          {/* Close */}
          <button
            onClick={() => router.back()}
            className="absolute right-5 top-5 h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition flex items-center justify-center"
          >
            <X size={20} />
          </button>

          <h1 className="text-3xl font-bold">Create Account</h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>

          <form onSubmit={handleSignup} className="mt-8 space-y-5">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 px-4 focus-within:border-blue-500 transition">
                <User size={18} className="text-gray-400" />

                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-12 w-full bg-transparent px-3 outline-none"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Username <span className="text-red-500">*</span>
              </label>

              <div
                className={`flex items-center rounded-xl border px-4 transition ${
                  usernameError
                    ? "border-red-400"
                    : usernameTaken
                    ? "border-red-400"
                    : usernameAvailable
                    ? "border-green-500"
                    : "border-gray-300 dark:border-gray-700 focus-within:border-blue-500"
                }`}
              >
                <User size={18} className="text-gray-400" />

                <input
                  type="text"
                  placeholder="prakash_codes"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="h-12 w-full bg-transparent px-3 outline-none lowercase"
                />

                {checkingUsername && (
                  <Loader2
                    size={18}
                    className="animate-spin text-gray-400"
                  />
                )}

                {!checkingUsername && usernameAvailable && (
                  <CheckCircle2 size={18} className="text-green-500" />
                )}

                {!checkingUsername && usernameTaken && (
                  <XCircle size={18} className="text-red-500" />
                )}
              </div>

              <p className="mt-1 text-xs text-gray-400">
                Lowercase letters, numbers, “_” and “.” only — no spaces, no
                capital letters.
              </p>

              {usernameError && (
                <p className="mt-1 text-sm text-red-500">{usernameError}</p>
              )}

              {!usernameError && usernameTaken && (
                <div className="mt-2 rounded-xl bg-red-50 dark:bg-red-900/20 p-3">
                  <p className="text-sm text-red-500">
                    “{username}” is already taken. Try one of these instead:
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {usernameSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handlePickSuggestion(s)}
                        className="rounded-full border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!usernameError && usernameAvailable && (
                <p className="mt-1 text-sm text-green-600">
                  Username is available.
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>

              <div
                className={`flex items-center rounded-xl border px-4 transition ${
                  emailError
                    ? "border-red-400"
                    : "border-gray-300 dark:border-gray-700 focus-within:border-blue-500"
                }`}
              >
                <Mail size={18} className="text-gray-400" />

                <input
                  type="email"
                  placeholder="you@gmail.com or you@yourdomain.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={(e) => setEmailError(validateEmailFormat(e.target.value))}
                  required
                  className="h-12 w-full bg-transparent px-3 outline-none"
                />
              </div>

              <p className="mt-1 text-xs text-gray-400">
                Gmail addresses must end exactly in “@gmail.com”. Custom
                domain emails are also accepted.
              </p>

              {emailError && (
                <p className="mt-1 text-sm text-red-500">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Password <span className="text-red-500">*</span>
              </label>

              <div
                className={`flex items-center rounded-xl border px-4 transition ${
                  passwordError
                    ? "border-red-400"
                    : "border-gray-300 dark:border-gray-700 focus-within:border-blue-500"
                }`}
              >
                <Lock size={18} className="text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={(e) =>
                    setPasswordError(validatePasswordFormat(e.target.value))
                  }
                  required
                  className="h-12 w-full bg-transparent px-3 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-blue-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="mt-1 text-xs text-gray-400">
                At least 6 characters, with 1 uppercase, 1 lowercase, 1
                number, and 1 special character.
              </p>

              {passwordError && (
                <p className="mt-1 text-sm text-red-500">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Confirm Password <span className="text-red-500">*</span>
              </label>

              <div
                className={`flex items-center rounded-xl border px-4 transition ${
                  confirmPasswordError
                    ? "border-red-400"
                    : "border-gray-300 dark:border-gray-700 focus-within:border-blue-500"
                }`}
              >
                <Lock size={18} className="text-gray-400" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) =>
                    handleConfirmPasswordChange(e.target.value)
                  }
                  required
                  className="h-12 w-full bg-transparent px-3 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="text-gray-500 hover:text-blue-600 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {confirmPasswordError && (
                <p className="mt-1 text-sm text-red-500">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* Institution */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Institution / Organization
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 px-4 focus-within:border-blue-500 transition">
                <Building2 size={18} className="text-gray-400" />

                <input
                  type="text"
                  placeholder="XYZ University"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="h-12 w-full bg-transparent px-3 outline-none"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-100 dark:bg-red-900/30 p-3 text-sm text-red-600 dark:text-red-300">
                {error}
              </div>
            )}

            {/* Sign Up */}
            <button
              type="submit"
              disabled={loading || checkingUsername || usernameTaken}
              className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-3">
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>

              <span className="text-sm text-gray-400">OR</span>

              <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="h-12 w-full rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-3"
            >
              <FcGoogle size={24} />
              Continue with Google
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={handleGithubSignup}
              disabled={loading}
              className="mt-4 h-12 w-full rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-3"
            >
              <Github size={20} />
              Continue with GitHub
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            By creating an account, you agree to our{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>
            .
          </div>
        </div>
      </div>
    </main>
  );
}