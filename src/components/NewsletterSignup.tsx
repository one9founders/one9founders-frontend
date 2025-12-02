'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage('');

    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        setMessage('Thanks for subscribing!');
        setEmail('');
      } else {
        setMessage(result.error || 'Something went wrong');
      }
    } catch (error) {
      setMessage('Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-gray-900">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
        <p className="text-gray-300 mb-8">
          Get notified when we add new AI tools and features
        </p>
        
        <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
            disabled={loading}
            required
          />
          <button
            type="submit"
            disabled={loading || !email}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        
        {message && (
          <p className={`mt-4 text-sm ${message.includes('Thanks') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}