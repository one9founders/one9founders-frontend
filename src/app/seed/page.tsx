'use client';

import { seedDatabase } from '@/app/actions';
import { useState } from 'react';
import { showSuccess, showError } from '@/lib/sweetAlert';

export default function SeedPage() {
    const [status, setStatus] = useState<string>('');

    const handleSeed = async () => {
        setStatus('Seeding...');
        const result = await seedDatabase();
        if (result.success) {
            await showSuccess('Success!', 'Database seeded successfully!');
            setStatus('Database seeded successfully!');
        } else {
            await showError('Error', 'Error seeding database. Check console.');
            setStatus('Error seeding database. Check console.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="p-8 border border-gray-700 rounded-lg text-center">
                <h1 className="text-2xl font-bold mb-4">Database Seeder</h1>
                <p className="mb-6 text-gray-400">Click below to populate Supabase with initial data.</p>
                <button
                    onClick={handleSeed}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                >
                    Seed Database
                </button>
                {status && <p className="mt-4 text-sm">{status}</p>}
            </div>
        </div>
    );
}
