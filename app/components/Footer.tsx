"use client";

import Link from "next/link";
import {
  Github,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              CodeNFacts
            </Link>

            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Learn Programming, AI, Machine Learning, Data Science,
              Web Development and Placement Preparation through
              practical projects and industry-ready courses.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Link
                href="https://www.youtube.com/@CodeNFacts"
                target="_blank"
                className="text-slate-500 transition hover:text-red-600 dark:hover:text-red-500"
              >
                <Youtube size={20} />
              </Link>

              <Link
                href="https://www.linkedin.com/company/codenfacts"
                target="_blank"
                className="text-slate-500 transition hover:text-blue-600"
              >
                <Linkedin size={20} />
              </Link>

              <Link
                href="https://www.instagram.com/codenfacts"
                target="_blank"
                className="text-slate-500 transition hover:text-pink-600"
              >
                <Instagram size={20} />
              </Link>

              <Link
                href="https://github.com"
                target="_blank"
                className="text-slate-500 transition hover:text-slate-900 dark:hover:text-white"
              >
                <Github size={20} />
              </Link>
            </div>
          </div>

          {/* Learning */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Learning
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  href="/courses"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Courses
                </Link>
              </li>

              <li>
                <Link
                  href="/work-with-us"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Internship
                </Link>
              </li>

              <li>
                <Link
                  href="/roadmaps"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Roadmaps
                </Link>
              </li>

              <li>
                <Link
                  href="/blog"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Company
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/faq"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  FAQ
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Contact
            </h3>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Mail size={18} />
                <span>connect@codenfacts.in</span>
              </div>

              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <MapPin size={18} />
                <span>India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div className="mt-12 border-t border-slate-200 pt-6 dark:border-slate-800">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
            <p>
              © {year} CodeNFacts. All rights reserved.
            </p>

            <p>
              Built with ❤️ for Coders
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
