import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';

export const metadata = {
  title: {
    default: "CodeNFacts | Learn Coding, AI/ML, DSA & Placement Preparation",
    template: "%s | CodeNFacts",
  },
  description:
    "CodeNFacts is a practical coding platform to learn programming,AI &ML, Data Structures & Algorithms, interview preparation, and real-world development skills. Start your coding journey today.",
  keywords: [
    "learn coding",
    "DSA course",
    "coding for beginners",
    "placement preparation",
    "programming courses",
    "online coding classes",
    "data structures and algorithms",
    "software engineering preparation",
    "coding interview preparation",
    "CodeNFacts",
    "coding",
    "AI & Ml",
    "Complete AI Course",
    "ML course",
    "complete Data Science Course",
    "Master AI/ML",
    "interview preparation",
    "Coding",
    "C programming Course",
    "Complete java course",
    "HTML/CSS course",
    "Coding Tuitorials",
  ],

  metadataBase: new URL("https://codenfacts.in"),

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  openGraph: {
    title: "CodeNFacts | Learn Coding, AI/ML & Placement Preparation",
    description:
      "Master coding, AI/ML, and interview skills with practical courses at CodeNFacts. Learn step-by-step and get job-ready.",
    url: "https://codenfacts.in",
    siteName: "CodeNFacts",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeNFacts - Learn Coding",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "CodeNFacts | Learn Coding, AI, DSA & Placement Preparation",
    description:
      "Learn coding, AI/ML, and real-world development with structured courses at CodeNFacts.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        <Header />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
