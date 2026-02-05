'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';

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

    const { error } = await supabase.from('mentorship_applications').insert([
      { ...formData },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
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
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 overflow-hidden py-24 px-4">
      {/* Background particles / stars */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-3xl top-10 left-1/4 animate-pulse"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/30 blur-2xl bottom-10 right-1/3 animate-pulse"
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
        <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
          Apply for 1:1 Mentorship
        </h1>
        <p className="text-gray-300 mt-4 text-lg md:text-xl">
          Personalized guidance for your coding journey. Fill your details below to get started.
        </p>
      </motion.div>

      {/* Form with 3D tilt */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className="relative z-10 w-full max-w-4xl p-10 md:p-16 bg-gray-800/80 border border-white/20 rounded-3xl shadow-2xl backdrop-blur-xl"
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <motion.input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
            whileFocus={{ scale: 1.03, boxShadow: '0 0 25px rgba(59,130,246,0.6)' }}
          />

          {/* Last Name */}
          <motion.input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
            whileFocus={{ scale: 1.03, boxShadow: '0 0 25px rgba(59,130,246,0.6)' }}
          />

          {/* Email */}
          <motion.input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300 col-span-1 md:col-span-2"
            whileFocus={{ scale: 1.03, boxShadow: '0 0 25px rgba(59,130,246,0.6)' }}
          />

          {/* Mobile */}
          <motion.input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
            whileFocus={{ scale: 1.03, boxShadow: '0 0 25px rgba(59,130,246,0.6)' }}
          />

          {/* Education */}
          <motion.select
            name="education"
            value={formData.education}
            onChange={handleChange}
            required
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            whileFocus={{ scale: 1.03, boxShadow: '0 0 25px rgba(59,130,246,0.6)' }}
          >
            <option value="">Current Education</option>
            <option value="High School">High School</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Postgraduate">Postgraduate</option>
            <option value="Working Professional">Working Professional</option>
          </motion.select>

          {/* Experience */}
          <motion.input
            type="text"
            name="experience"
            placeholder="Work Experience (if any)"
            value={formData.experience}
            onChange={handleChange}
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
            whileFocus={{ scale: 1.03, boxShadow: '0 0 25px rgba(59,130,246,0.6)' }}
          />

          {/* Placement Goal */}
          <motion.select
            name="placementGoal"
            value={formData.placementGoal}
            onChange={handleChange}
            required
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            whileFocus={{ scale: 1.03, boxShadow: '0 0 25px rgba(59,130,246,0.6)' }}
          >
            <option value="">Goal for Placement</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="AI/ML Engineer">AI/ML Engineer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
          </motion.select>

          {/* Motivation Message */}
          <motion.textarea
            name="message"
            placeholder="Why do you want this mentorship?"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
            className="p-4 rounded-xl bg-gray-700/60 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300 col-span-1 md:col-span-2"
            whileFocus={{ scale: 1.03, boxShadow: '0 0 25px rgba(59,130,246,0.6)' }}
          />

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-3xl shadow-xl hover:shadow-2xl transition-all text-lg"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </motion.button>
        </form>
      </motion.div>

      {/* Success Message */}
      {success && (
        <motion.p
          className="absolute bottom-10 text-green-400 font-bold text-lg animate-pulse"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your application has been submitted successfully!
        </motion.p>
      )}
    </section>
  );
}
