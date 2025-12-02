'use client';

import { useState, useEffect } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  onClear: () => void;
}

export default function SearchInput({ onSearch, onClear }: SearchInputProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query);
      } else {
        onClear();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]); // Remove onSearch and onClear from dependencies

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for AI tools... (e.g., 'tools for writing emails')"
          className="w-full px-6 py-4 text-lg rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
          style={{ backgroundColor: 'var(--gray-900)', border: '1px solid var(--gray-700)', color: 'white' }}
        />
        <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6" style={{ color: 'var(--gray-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}
