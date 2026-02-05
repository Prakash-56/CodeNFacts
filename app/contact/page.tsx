'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just simulate submit
    console.log('Form Submitted', form);
    setSubmitted(true);
  };

  return (
    <motion.section
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-5xl font-bold text-white mb-6">Get in Touch</h1>
      <p className="text-gray-300 mb-12 text-center max-w-2xl">
        We'd love to hear from you! Fill the form below and our team will reach out to you soon.
      </p>

      {submitted ? (
        <motion.div
          className="bg-green-600/20 text-green-200 p-8 rounded-3xl shadow-xl text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
          <p>We'll get back to you shortly.</p>
        </motion.div>
      ) : (
        <motion.form
          className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-lg w-full flex flex-col gap-6"
          onSubmit={handleSubmit}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none h-32"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl shadow-xl transition-all hover:shadow-2xl"
          >
            Send Message
          </button>
        </motion.form>
      )}
    </motion.section>
  );
}
