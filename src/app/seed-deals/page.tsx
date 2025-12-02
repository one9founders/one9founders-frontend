'use client';

import { useState } from 'react';
import { seedDeals } from '../actions';

export default function SeedDealsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const result = await seedDeals();
      if (result.success) {
        setMessage('Deals seeded successfully!');
      } else {
        setMessage('Failed to seed deals. Check console for errors.');
      }
    } catch (error) {
      setMessage('Error seeding deals. Check console for details.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6">Seed Deals Database</h1>
        <p className="text-gray-300 mb-6">
          Click the button below to populate the database with sample deals and offers.
        </p>
        <button
          onClick={handleSeed}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Seeding Deals...' : 'Seed Deals'}
        </button>
        {message && (
          <p className={`mt-4 text-sm ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}