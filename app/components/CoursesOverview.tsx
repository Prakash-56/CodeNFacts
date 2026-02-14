"use client";

import { motion } from "framer-motion";
import CourseCard from "./CourseCard";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const courses = [
  {
    title: "Python for Data Science",
    slug: "python-ds",
    description:
      "Master Python from scratch to advanced data visualization and automation.",
    price: 2499,
    originalPrice: 4999,
    discountLabel: "50% OFF",
    image: "/course/python.jpg",
    level: "Beginner",
    duration: "4 Weeks",
    projects: 5,
    startDate: "Coming Soon..",
    rating: 4.9,
  },
  {
    title: "OOP with Java",
    slug: "java-oop",
    description:
      "Deep dive into Classes, Inheritance, Polymorphism and Design Patterns.",
    price: 2999,
    originalPrice: 3999,
    discountLabel: "Early Bird",
    image: "/course/java.jpg",
    level: "Intermediate",
    duration: "6 Weeks",
    projects: 3,
    startDate: "Coming Soon..",
    rating: 4.7,
  },
  {
    title: "Complete LinkedIn Setup",
    slug: "linkedin-mastery",
    description:
      "Optimize your profile, networking strategies, and personal branding.",
    price: 999,
    originalPrice: 1999,
    discountLabel: "Best Seller",
    image: "/course/linkedin.jpg",
    level: "Beginner",
    duration: "1 Week",
    projects: 1,
    startDate: "Coming Soon..",
    rating: 5.0,
  },
  {
    title: "Mastering C Language",
    slug: "learn-c",
    description:
      "The foundation of programming. Pointers, Memory, and Logic building.",
    price: 1499,
    originalPrice: 2999,
    discountLabel: "Student Special",
    image: "/course/c-lang.jpg",
    level: "Beginner",
    duration: "5 Weeks",
    projects: 12,
    startDate: "Coming Soon..",
    rating: 4.6,
  },
  {
    title: "Learn Complete HTML/CSS",
    slug: "html-css",
    description:
      "Responsive design, Flexbox, Grid, and Modern CSS Animations.",
    price: 1299,
    originalPrice: 2499,
    discountLabel: "New Launch",
    image: "/course/html-css.jpg",
    level: "Beginner",
    duration: "3 Weeks",
    projects: 4,
    startDate: "Coming Soon..",
    rating: 4.8,
  },
  {
    title: "AI / Machine Learning",
    slug: "ai-ml",
    description: "Learn AI concepts, models, and real-world ML projects.",
    price: 4999,
    originalPrice: 7999,
    discountLabel: "Premium",
    image: "/course/ai-ml.jpg",
    level: "Advanced",
    duration: "10 Weeks",
    projects: 6,
    startDate: "Coming Soon..",
    rating: 4.9,
  },
  {
    title: "Data Structures & Algorithms",
    slug: "dsa",
    description:
      "Master coding patterns for interviews and problem-solving.",
    price: 3999,
    originalPrice: 5999,
    discountLabel: "Job Ready",
    image: "/course/dsa.jpg",
    level: "Intermediate",
    duration: "8 Weeks",
    projects: 15,
    startDate: "Coming Soon..",
    rating: 4.9,
  },
  {
    title: "Data Science",
    slug: "data-science",
    description: "Analyze, visualize, and interpret data like a pro.",
    price: 5499,
    originalPrice: 9999,
    discountLabel: "45% OFF",
    image: "/course/data-scientist.jpg",
    level: "Advanced",
    duration: "14 Weeks",
    projects: 7,
    startDate: "Coming Soon..",
    rating: 4.8,
  },
  {
    title: "Web Development",
    slug: "web-development",
    description:
      "Full-stack development with React, Next.js, and Node.js.",
    price: 4999,
    originalPrice: 8999,
    discountLabel: "Flash Sale",
    image: "/course/webdevelopment.jpg",
    level: "Intermediate",
    duration: "12 Weeks",
    projects: 10,
    startDate: "Coming Soon..",
    rating: 4.7,
  },
];

export default function CoursesOverview() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="relative py-24 bg-[#020617] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-black text-white"
          >
            Our <span className="text-blue-500">Courses</span>
          </motion.h2>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
            Premium learning paths for the next generation of tech leaders.
          </p>
        </div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {courses.map((course) => (
            <CourseCard
              key={course.slug}
              {...course}
              courseId={course.slug}
              userId={userId || "guest"}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
