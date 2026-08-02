// lib/types/application.ts
// Shared types for the CodeNFacts internship application form.
// Imported by both app/apply/page.tsx (client) and app/api/apply/route.ts (server).

export const TRACKS = [
  "Frontend Engineering",
  "UI/UX Design",
  "AI Engineering",
  "DevOps / Cloud",
] as const;

export type Track = (typeof TRACKS)[number];

export const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const CURRENT_YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Final Year",
  "Graduated",
] as const;

export type CurrentYearOfStudy = (typeof CURRENT_YEAR_OPTIONS)[number];

export const JOIN_FROM_OPTIONS = [
  "Immediately",
  "Within 1 week",
  "Within 2 weeks",
  "Within 1 month",
  "After my exams / a specific date",
] as const;

export type JoinFrom = (typeof JOIN_FROM_OPTIONS)[number];

/**
 * Raw text-field shape of the application. `resume` is handled separately as a
 * File on the client and as a Blob/Buffer on the server since it travels over
 * multipart/form-data rather than JSON.
 */
export interface ApplicationFormData {
  fullName: string;
  email: string;
  track: Track | "";
  collegeName: string;
  graduationYear: string;
  currentYear: CurrentYearOfStudy | "";
  cgpa: string;
  contactNumber: string;
  githubProfile: string; // optional
  linkedinProfile: string;
  experienceLevel: ExperienceLevel | "";
  project1: string;
  project2: string;
  whyThisOpportunity: string;
  aboutCodeNFacts: string;
  subscribed: "Yes" | "No" | "";
  joinFrom: JoinFrom | "";
  anythingElse: string; // optional
}

export const EMPTY_APPLICATION: ApplicationFormData = {
  fullName: "",
  email: "",
  track: "",
  collegeName: "",
  graduationYear: "",
  currentYear: "",
  cgpa: "",
  contactNumber: "",
  githubProfile: "",
  linkedinProfile: "",
  experienceLevel: "",
  project1: "",
  project2: "",
  whyThisOpportunity: "",
  aboutCodeNFacts: "",
  subscribed: "",
  joinFrom: "",
  anythingElse: "",
};

export type ApplicationFormErrors = Partial<Record<keyof ApplicationFormData | "resume", string>>;

export interface ApplyApiSuccessResponse {
  success: true;
  message: string;
}

export interface ApplyApiErrorResponse {
  success: false;
  error: string;
}

export type ApplyApiResponse = ApplyApiSuccessResponse | ApplyApiErrorResponse;