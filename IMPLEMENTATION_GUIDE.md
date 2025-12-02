# One9Founders - Step-by-Step Implementation Guide

## Prerequisites

- Node.js 18+ installed
- Git installed
- Supabase account
- Google AI Studio account

## Phase 1: Project Setup

### Step 1: Initialize Next.js Project
```bash
npx create-next-app@latest one9founders --typescript --tailwind --app
cd one9founders
```

### Step 2: Install Dependencies
```bash
npm install @supabase/supabase-js @google/generative-ai
```

### Step 3: Configure Package.json
```json
{
  "name": "one9founders",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@google/generative-ai": "^0.24.1",
    "@supabase/supabase-js": "^2.86.0",
    "next": "15.5.5",
    "react": "19.1.0",
    "react-dom": "19.1.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

## Phase 2: External Services Setup

### Step 4: Setup Supabase Database

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down URL and anon key

2. **Create Database Schema**
   - Go to SQL Editor in Supabase dashboard
   - Run the following SQL:

```sql
-- Enable the pgvector extension
CREATE EXTENSION vector;

-- Create tools table
CREATE TABLE tools (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  url TEXT,
  image_url TEXT,
  embedding VECTOR(768)
);

-- Create search function
CREATE OR REPLACE FUNCTION match_tools (
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id BIGINT,
  name TEXT,
  description TEXT,
  category TEXT,
  url TEXT,
  image_url TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tools.id,
    tools.name,
    tools.description,
    tools.category,
    tools.url,
    tools.image_url,
    1 - (tools.embedding <=> query_embedding) AS similarity
  FROM tools
  WHERE 1 - (tools.embedding <=> query_embedding) > match_threshold
  ORDER BY tools.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### Step 5: Setup Google AI Studio
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create API key
3. Note down the API key

### Step 6: Environment Configuration
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_API_KEY=your_google_ai_studio_key
```

## Phase 3: Core Infrastructure

### Step 7: Create Type Definitions
Create `src/types/index.ts`:
```typescript
export interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  url: string;
  image_url: string;
  similarity?: number;
}
```

### Step 8: Setup Client Libraries
Create `src/lib/supabaseClient.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Create `src/lib/geminiClient.ts`:
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn("GOOGLE_API_KEY is not set in environment variables.");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");
```

## Phase 4: Backend Implementation

### Step 9: Create Server Actions
Create `src/app/actions.ts`:
```typescript
'use server';

import { genAI } from '@/lib/geminiClient';
import { supabase } from '@/lib/supabaseClient';

export async function searchTools(query: string) {
  if (!query) return [];

  try {
    // Generate embedding for search query
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(query);
    const embedding = result.embedding.values;

    // Search in Supabase using match_tools function
    const { data: tools, error } = await supabase.rpc('match_tools', {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 10,
    });

    if (error) {
      console.error('Supabase search error:', error);
      return [];
    }

    return tools;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export async function seedDatabase() {
  const portfolioData = [
    { name: "ChatGPT", description: "AI-powered conversational assistant", category: "AI", image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop" },
    { name: "Midjourney", description: "AI image generation platform", category: "AI", image_url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=200&fit=crop" },
    { name: "Notion AI", description: "Smart workspace and productivity", category: "Productivity", image_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop" },
    { name: "Figma AI", description: "Design collaboration with AI", category: "Design", image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop" },
    { name: "GitHub Copilot", description: "AI pair programming assistant", category: "Development", image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop" },
    { name: "Jasper AI", description: "AI content creation platform", category: "Content", image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop" },
    { name: "Loom AI", description: "Video messaging with AI features", category: "Video", image_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=300&h=200&fit=crop" },
    { name: "Grammarly", description: "AI writing and grammar assistant", category: "Writing", image_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop" },
  ];

  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    for (const tool of portfolioData) {
      const result = await model.embedContent(tool.description);
      const embedding = result.embedding.values;

      const { error } = await supabase.from('tools').insert({
        name: tool.name,
        description: tool.description,
        category: tool.category,
        image_url: tool.image_url,
        embedding,
      });

      if (error) {
        console.error(`Error inserting ${tool.name}:`, error);
      } else {
        console.log(`Inserted ${tool.name}`);
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Seed error:', error);
    return { success: false, error };
  }
}
```

## Phase 5: Frontend Components

### Step 10: Create Layout Component
Update `src/app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "One9Founders - AI Tool Directory",
  description: "Discover AI tools for founders and startups",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bricolageGrotesque.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

### Step 11: Create Main Page
Update `src/app/page.tsx`:
```typescript
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import PortfolioSection from "../components/PortfolioSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--gray-black)' }}>
      <Navbar />
      <HeroSection />
      <PortfolioSection />
      <Footer />
    </div>
  );
}
```

### Step 12: Create UI Components

Create `src/components/Navbar.tsx`:
```typescript
export default function Navbar() {
  return (
    <nav className="w-full p-4 bg-gray-900">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">One9Founders</h1>
        <div className="text-gray-300">AI Tool Directory</div>
      </div>
    </nav>
  );
}
```

Create `src/components/HeroSection.tsx`:
```typescript
import SearchInput from './SearchInput';

export default function HeroSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Discover AI Tools for Founders
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          Find the perfect AI tools for your startup with intelligent semantic search
        </p>
        <SearchInput />
      </div>
    </section>
  );
}
```

Create `src/components/SearchInput.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { searchTools } from '@/app/actions';
import { Tool } from '@/types';

interface SearchInputProps {
  onResults?: (results: Tool[]) => void;
}

export default function SearchInput({ onResults }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchTools(query);
      onResults?.(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for AI tools... (e.g., 'tools for writing emails')"
          className="flex-1 px-6 py-4 text-lg rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}
```

Create `src/components/PortfolioSection.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { Tool } from '@/types';
import SearchInput from './SearchInput';

export default function PortfolioSection() {
  const [results, setResults] = useState<Tool[]>([]);

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <SearchInput onResults={setResults} />
        </div>
        
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((tool) => (
              <div key={tool.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <img
                  src={tool.image_url}
                  alt={tool.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-white mb-2">{tool.name}</h3>
                <p className="text-gray-300 mb-4">{tool.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-400">{tool.category}</span>
                  {tool.similarity && (
                    <span className="text-sm text-green-400">
                      {Math.round(tool.similarity * 100)}% match
                    </span>
                  )}
                </div>
                {tool.url && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Visit Tool
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

Create `src/components/Footer.tsx`:
```typescript
export default function Footer() {
  return (
    <footer className="py-8 px-4 bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto text-center text-gray-400">
        <p>&copy; 2024 One9Founders. Built for founders, by founders.</p>
      </div>
    </footer>
  );
}
```

## Phase 6: Database Seeding

### Step 13: Create Seed Page
Create `src/app/seed/page.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { seedDatabase } from '../actions';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const result = await seedDatabase();
      if (result.success) {
        setMessage('Database seeded successfully!');
      } else {
        setMessage('Failed to seed database. Check console for errors.');
      }
    } catch (error) {
      setMessage('Error seeding database. Check console for details.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6">Database Seeding</h1>
        <p className="text-gray-300 mb-6">
          Click the button below to populate the database with initial AI tools and their embeddings.
        </p>
        <button
          onClick={handleSeed}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Seeding Database...' : 'Seed Database'}
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
```

## Phase 7: Styling and Configuration

### Step 14: Configure Tailwind CSS
Update `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --gray-black: #0a0a0a;
}

body {
  background-color: var(--gray-black);
  color: white;
}
```

## Phase 8: Testing and Deployment

### Step 15: Local Testing
```bash
# Start development server
npm run dev

# Visit http://localhost:3000/seed to seed database
# Visit http://localhost:3000 to test the application
```

### Step 16: Build and Deploy
```bash
# Build for production
npm run build

# Deploy to Vercel (recommended)
npx vercel

# Or deploy to your preferred platform
```

## Phase 9: CRITICAL FIXES REQUIRED

### ❌ Current Issues in Existing Implementation

#### Issue 1: Missing CSS Variables
The components use CSS variables that don't exist. Fix `src/app/globals.css`:

```css
:root {
  --gray-black: #0A0A0A;  /* ADD THIS LINE */
  --gray-900: #171717;
  --gray-800: #262626;
  --gray-700: #404040;
  --gray-500: #737373;
  /* ... other existing variables */
}
```

#### Issue 2: PortfolioSection Uses Static Data
Replace hardcoded data with database integration in `src/components/PortfolioSection.tsx`

#### Issue 3: Fix Navigation Links
Update `src/components/Navbar.tsx` to use proper Link components

#### Issue 4: Fix HeroSection Button
Make "Explore Tools" button functional

#### Issue 5: Fix Metadata
Update proper SEO metadata in layout.tsx

## Phase 10: Verification Checklist

### ✅ Backend (Complete)
- [x] Environment variables configured
- [x] Supabase database created with pgvector extension
- [x] Google AI Studio API key working
- [x] Database seeded with initial tools
- [x] Search functionality working
- [x] Admin dashboard functional

### ❌ Frontend (Needs Fixes)
- [ ] CSS variables fixed
- [ ] PortfolioSection connected to database
- [ ] Navigation links functional
- [ ] Search integration working
- [ ] Proper metadata set
- [ ] Button actions implemented

## Troubleshooting

### Critical Issues:
1. **CSS not loading**: Check CSS variable definitions in globals.css
2. **Static data showing**: Ensure PortfolioSection uses getAllTools()
3. **Navigation not working**: Add proper Link components
4. **Search not integrated**: Connect SearchInput to main display
5. **Buttons not functional**: Add proper click handlers and routing

### Performance Optimization:
- Add image optimization with Next.js Image component
- Implement search debouncing (already done)
- Add loading states and error boundaries
- Configure proper caching headers

This implementation guide now reflects the current state and identifies specific fixes needed.