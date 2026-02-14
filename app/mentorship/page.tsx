'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function MentorshipPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    education: '',
    experience: '',
    placementGoal: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 3D Tilt Effect
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-50, 50], [15, -15]);
  const rotateY = useTransform(mouseX, [-50, 50], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'mentorship_applications'), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        education: '',
        experience: '',
        placementGoal: '',
        message: '',
      });
    } catch (error: any) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 overflow-hidden py-24 px-4">
      {/* Background particles */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-3xl top-10 left-1/4"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/30 blur-2xl bottom-10 right-1/3"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* Header */}
      <motion.div
        className="text-center mb-16 max-w-3xl"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white">
          Apply for 1:1 Mentorship
        </h1>
        <p className="text-gray-300 mt-4 text-lg md:text-xl">
          Personalized guidance for your coding journey.
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className="relative z-10 w-full max-w-4xl p-10 md:p-16 bg-gray-800/80 border border-white/20 rounded-3xl shadow-2xl backdrop-blur-xl"
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 text-white"
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 text-white md:col-span-2"
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 text-white"
          />

          <select
            name="education"
            value={formData.education}
            onChange={handleChange}
            required
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 text-white"
          >
            <option value="">Current Education</option>
            <option value="High School">High School</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Postgraduate">Postgraduate</option>
            <option value="Working Professional">Working Professional</option>
          </select>

          <input
            type="text"
            name="experience"
            placeholder="Work Experience (if any)"
            value={formData.experience}
            onChange={handleChange}
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 text-white"
          />

          <select
            name="placementGoal"
            value={formData.placementGoal}
            onChange={handleChange}
            required
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 text-white"
          >
            <option value="">Goal for Placement</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="AI/ML Engineer">AI/ML Engineer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
          </select>

          <textarea
            name="message"
            placeholder="Why do you want this mentorship?"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 text-white md:col-span-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-3xl"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </motion.div>

      {success && (
        <p className="absolute bottom-10 text-green-400 font-bold text-lg">
          Your application has been submitted successfully!
        </p>
      )}
    </section>
  );
}
