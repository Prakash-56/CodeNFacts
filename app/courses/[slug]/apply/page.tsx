'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface ApplyPageProps {
  params: { slug: string };
}

export default function ApplyPage({ params }: ApplyPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const price = searchParams.get('price') || '0'; // price from query

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, course: params.slug, price } },
    });

    if (error) setError(error.message);
    else {
      alert(`Signup successful for ${params.slug}! Price: ₹${price}`);
      router.push('/');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6 py-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h1 className="text-3xl font-bold text-white text-center">
          Apply for {params.slug.replace('-', ' ')}
        </h1>
        <p className="text-gray-400 text-center">Course Price: ₹{price}</p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all"
        >
          {loading ? 'Applying...' : `Apply Now for ₹${price}`}
        </button>
      </form>
    </main>
  );
}
