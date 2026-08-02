import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import Script from "next/script";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: {
    default:
      "CodeNFacts | AI, Data Science, DSA, Coding Problems, Quizzes & Placement Prep",
    template: "%s | CodeNFacts",
  },

  description:
    "CodeNFacts is your complete coding platform: 3000+ coding problems, quizzes, concepts, notes, full course lessons, real-world projects, community, internships, logic building & brain development. Master AI & ML, Data Science, DSA, Web Development, and crack placements with structured roadmaps. All major programming languages covered. Start free today.",

  keywords: [
    "CodeNFacts",
    "codenfacts",
    "Code N Facts",
    "coding",
    "code",
    "code facts",
    "coding problems",
    "3000+ coding questions",
    "coding quizzes",
    "programming quizzes",
    "coding concepts",
    "programming notes",
    "course lessons",
    "online coding courses",
    "coding projects",
    "real world projects",
    "coding community",
    "internship",
    "coding internship",
    "logic building",
    "brain development coding",
    "problem solving skills",
    "AI course",
    "ML course",
    "machine learning course",
    "AI and ML course",
    "data science course",
    "DSA course",
    "data structures and algorithms",
    "Python programming course",
    "Java course",
    "C++ course",
    "JavaScript course",
    "TypeScript course",
    "C programming",
    "Go programming",
    "Rust programming",
    "web development course",
    "React course",
    "Next.js course",
    "MERN stack course",
    "full stack development",
    "placement preparation",
    "coding interview preparation",
    "software engineering interview",
    "online coding platform",
    "learn coding",
    "coding for beginners",
    "practice coding online",
    "competitive programming",
    "interview questions",
    "coding notes",
    "tech community",
  ],

  metadataBase: new URL("https://codenfacts.in"),

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title:
      "CodeNFacts | 3000+ Coding Problems, AI, DSA, Quizzes, Projects & Placement Prep",
    description:
      "Master coding with 3000+ problems, quizzes, concepts, notes, full lessons, projects, community & internships. Learn AI, ML, Data Science, DSA, Web Dev and crack placements at CodeNFacts.",
    url: "https://codenfacts.in",
    siteName: "CodeNFacts",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeNFacts - Coding Problems, Courses, Quizzes & Placement Preparation",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "CodeNFacts | 3000+ Coding Problems, AI, DSA, Quizzes & Placement Prep",
    description:
      "Practice 3000+ coding questions, take quizzes, learn concepts & notes, build projects, join the community and prepare for internships & placements with CodeNFacts.",
    images: ["/og-image.png"],
    site: "@codenfacts",
    creator: "@codenfacts",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  category: "education",
  creator: "CodeNFacts",
  publisher: "CodeNFacts",

  authors: [
    {
      name: "CodeNFacts Team",
      url: "https://codenfacts.in",
    },
  ],

  applicationName: "CodeNFacts",

  referrer: "origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "CodeNFacts",
              url: "https://codenfacts.in",
              logo: "https://codenfacts.in/logo.png",
              sameAs: [
                "https://www.youtube.com/@CodeNFacts",
                "https://www.instagram.com/codenfacts",
                "https://www.linkedin.com/company/codenfacts",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                url: "https://codenfacts.in/contact",
              },
            }),
          }}
        />

        {/* Educational Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "CodeNFacts",
              description:
                "CodeNFacts is a complete coding education platform offering 3000+ coding problems, quizzes, concepts, notes, full course lessons, real-world projects, community, internships, logic building, and placement preparation across AI, Data Science, DSA, Web Development and all major programming languages.",
              url: "https://codenfacts.in",
              logo: "https://codenfacts.in/logo.png",
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
              },
            }),
          }}
        />

        {/* Website + SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CodeNFacts",
              url: "https://codenfacts.in",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://codenfacts.in/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* LearningResource / Course aggregate for richer SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "CodeNFacts Learning Resources",
              description:
                "Coding problems, quizzes, concepts, notes, course lessons, projects, community and internship preparation on CodeNFacts",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "3000+ Coding Problems & Questions",
                  url: "https://codenfacts.in",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Coding Quizzes & Practice",
                  url: "https://codenfacts.in",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Programming Concepts & Notes",
                  url: "https://codenfacts.in",
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "Full Course Lessons (AI, DSA, Web Dev & more)",
                  url: "https://codenfacts.in",
                },
                {
                  "@type": "ListItem",
                  position: 5,
                  name: "Real-World Projects",
                  url: "https://codenfacts.in",
                },
                {
                  "@type": "ListItem",
                  position: 6,
                  name: "Community & Logic Building",
                  url: "https://codenfacts.in",
                },
                {
                  "@type": "ListItem",
                  position: 7,
                  name: "Internships & Placement Preparation",
                  url: "https://codenfacts.in",
                },
              ],
            }),
          }}
        />
      </head>

      <body
        className="
          min-h-screen
          bg-white
          text-slate-900
          antialiased
          transition-colors
          duration-300
          dark:bg-slate-950
          dark:text-white
        "
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Cashfree Payment SDK */}
            <Script
              src="https://sdk.cashfree.com/js/v3/cashfree.js"
              strategy="afterInteractive"
            />

            <Header />

            <PageTransition>{children}</PageTransition>

            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}