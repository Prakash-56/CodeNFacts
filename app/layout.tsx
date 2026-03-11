import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  // ─────────────────────────────────────────────
  // TITLE
  // ─────────────────────────────────────────────
  title: {
    default: "CodeNFacts | AI, Data Science, DSA & Placement Preparation Courses",
    template: "%s | CodeNFacts",
  },

  // ─────────────────────────────────────────────
  // DESCRIPTION  (140–160 chars ideal)
  // ─────────────────────────────────────────────
  description:
    "CodeNFacts offers industry-ready courses in AI & ML, Data Science, DSA, Web Development, and Placement Preparation. Learn with real-world projects, mentorship, and structured roadmaps. Start free today.",

  // ─────────────────────────────────────────────
  // KEYWORDS  (grouped by topic)
  // ─────────────────────────────────────────────
  keywords: [
    // Brand
    "CodeNFacts",
    "codenfacts",
    "Code N Facts",
    "code facts",
    "Code Facts",
    "codenfacts.in",

    // AI & ML
    "AI course",
    "machine learning course",
    "AI and ML course",
    "complete AI course",
    "complete machine learning course",
    "master AI ML",
    "artificial intelligence for beginners",
    "deep learning course",
    "neural networks course",
    "NLP course",
    "computer vision course",
    "generative AI course",
    "prompt engineering",
    "LLM course",

    // Data Science
    "data science course",
    "complete data science course",
    "data science for beginners",
    "data analysis course",
    "data science with Python",
    "pandas course",
    "numpy course",
    "data visualization course",
    "Power BI course",
    "Tableau course",
    "SQL for data science",
    "statistics for data science",

    // DSA & CS Fundamentals
    "DSA course",
    "data structures and algorithms",
    "DSA in Python",
    "DSA in Java",
    "DSA in C++",
    "competitive programming",
    "leetcode preparation",
    "problem solving course",
    "algorithm design",

    // Programming Languages
    "Python programming course",
    "Java course",
    "complete Java course",
    "C programming course",
    "C++ course",
    "JavaScript course",
    "TypeScript course",
    "programming for beginners",
    "learn coding",
    "coding for beginners",
    "online coding classes",

    // Web Development
    "web development course",
    "HTML CSS course",
    "React course",
    "Next.js course",
    "full stack development",
    "frontend development",
    "backend development",
    "MERN stack course",

    // Placement & Career
    "placement preparation",
    "coding interview preparation",
    "software engineering interview",
    "interview preparation",
    "placement course India",
    "campus placement preparation",
    "get placed in tech company",
    "resume building for freshers",
    "mock interview",
    "tech interview tips",
    "FAANG preparation",
    "product based company preparation",

    // Internship
    "codenfacts internship",
    "CodeNFacts Internship",
    "internship",
    "data science internship",
    "AI ML internship",
    "software development internship",
    "online internship India",

    // Platform
    "online coding platform",
    "online learning platform India",
    "programming tutorials",
    "coding tutorials",
    "free coding resources",
    "online c compiler",
    "coding bootcamp India",
    "upskilling platform",
    "tech career roadmap",
  ],

  // ─────────────────────────────────────────────
  // BASE & CANONICAL
  // ─────────────────────────────────────────────
  metadataBase: new URL("https://codenfacts.in"),

  alternates: {
    canonical: "/",
  },

  // ─────────────────────────────────────────────
  // ICONS
  // ─────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // ─────────────────────────────────────────────
  // OPEN GRAPH
  // ─────────────────────────────────────────────
  openGraph: {
    title: "CodeNFacts | AI, Data Science, DSA & Placement Preparation Courses",
    description:
      "Master AI & ML, Data Science, DSA, Web Development, and crack placement interviews with CodeNFacts. Real projects. Expert mentorship. Industry-ready skills.",
    url: "https://codenfacts.in",
    siteName: "CodeNFacts",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeNFacts - AI, Data Science & Placement Preparation Courses",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  // ─────────────────────────────────────────────
  // TWITTER / X
  // ─────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "CodeNFacts | AI, Data Science, DSA & Placement Preparation",
    description:
      "Learn AI, ML, Data Science, DSA and crack placement interviews with structured courses and real-world projects at CodeNFacts.",
    images: ["/og-image.png"],
    site: "@codenfacts",
    creator: "@codenfacts",
  },

  // ─────────────────────────────────────────────
  // ROBOTS & INDEXING
  // ─────────────────────────────────────────────
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


  // ─────────────────────────────────────────────
  // ADDITIONAL META
  // ─────────────────────────────────────────────
  category: "education",
  creator: "CodeNFacts",
  publisher: "CodeNFacts",
  authors: [{ name: "CodeNFacts Team", url: "https://codenfacts.in" }],
  applicationName: "CodeNFacts",
  referrer: "origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ── Structured Data: Organization ── */}
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

        {/* ── Structured Data: EducationalOrganization ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "CodeNFacts",
              description:
                "CodeNFacts provides industry-ready AI, Data Science, DSA, and Placement Preparation courses with real-world projects and mentorship.",
              url: "https://codenfacts.in",
              logo: "https://codenfacts.in/logo.png",
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
              },
            }),
          }}
        />

        {/* ── Structured Data: WebSite + Sitelinks Searchbox ── */}
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
      </head>

      <body className="antialiased bg-black text-white">
        {/* Cashfree Payment SDK */}
        <Script
          src="https://sdk.cashfree.com/js/v3/cashfree.js"
          strategy="afterInteractive"
        />

        <Header />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}