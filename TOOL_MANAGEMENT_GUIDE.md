# Tool Management & Data Collection Guide

## Overview
Multiple approaches to populate the One9Founders database with AI tools:

1. **Manual Admin Interface** - Curated tool addition
2. **Web Scraping** - Automated data collection
3. **API Integration** - Third-party data sources
4. **Bulk Import** - CSV/JSON file uploads
5. **Community Submissions** - User-generated content

## 1. Manual Admin Interface

### Create Admin Dashboard
Create `src/app/admin/page.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { addTool, getAllTools, deleteTool } from '../actions';
import { Tool } from '@/types';

export default function AdminPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    url: '',
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await addTool(formData);
    if (result.success) {
      setFormData({ name: '', description: '', category: '', url: '', image_url: '' });
      loadTools();
    }
    setLoading(false);
  };

  const loadTools = async () => {
    const allTools = await getAllTools();
    setTools(allTools);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        {/* Add Tool Form */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Add New Tool</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tool Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="p-3 bg-gray-700 text-white rounded"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="p-3 bg-gray-700 text-white rounded"
            />
            <input
              type="url"
              placeholder="Tool URL"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="p-3 bg-gray-700 text-white rounded"
            />
            <input
              type="url"
              placeholder="Image URL"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              className="p-3 bg-gray-700 text-white rounded"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="p-3 bg-gray-700 text-white rounded col-span-2"
              rows={3}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="col-span-2 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Tool'}
            </button>
          </form>
        </div>

        {/* Tools List */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">All Tools</h2>
            <button
              onClick={loadTools}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Refresh
            </button>
          </div>
          <div className="grid gap-4">
            {tools.map((tool) => (
              <div key={tool.id} className="bg-gray-700 p-4 rounded flex justify-between items-center">
                <div>
                  <h3 className="text-white font-semibold">{tool.name}</h3>
                  <p className="text-gray-300 text-sm">{tool.category}</p>
                </div>
                <button
                  onClick={() => deleteTool(tool.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Add Admin Server Actions
Add to `src/app/actions.ts`:
```typescript
export async function addTool(toolData: {
  name: string;
  description: string;
  category: string;
  url: string;
  image_url: string;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(toolData.description);
    const embedding = result.embedding.values;

    const { error } = await supabase.from('tools').insert({
      ...toolData,
      embedding,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Add tool error:', error);
    return { success: false, error };
  }
}

export async function getAllTools() {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('id, name, description, category, url, image_url')
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get tools error:', error);
    return [];
  }
}

export async function deleteTool(id: number) {
  try {
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Delete tool error:', error);
    return { success: false, error };
  }
}
```

## 2. Web Scraping System

### Install Scraping Dependencies
```bash
npm install puppeteer cheerio axios
npm install -D @types/puppeteer
```

### Create Scraping Service
Create `src/lib/scrapers.ts`:
```typescript
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from 'axios';

export interface ScrapedTool {
  name: string;
  description: string;
  category: string;
  url: string;
  image_url?: string;
}

// Scrape Product Hunt AI tools
export async function scrapeProductHunt(): Promise<ScrapedTool[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.producthunt.com/topics/artificial-intelligence');
    await page.waitForSelector('[data-test="post-item"]');

    const tools = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-test="post-item"]');
      return Array.from(items).slice(0, 20).map(item => {
        const nameEl = item.querySelector('h3');
        const descEl = item.querySelector('[data-test="post-description"]');
        const linkEl = item.querySelector('a');
        const imgEl = item.querySelector('img');

        return {
          name: nameEl?.textContent?.trim() || '',
          description: descEl?.textContent?.trim() || '',
          category: 'AI',
          url: linkEl ? `https://www.producthunt.com${linkEl.getAttribute('href')}` : '',
          image_url: imgEl?.getAttribute('src') || ''
        };
      }).filter(tool => tool.name && tool.description);
    });

    return tools;
  } finally {
    await browser.close();
  }
}

// Scrape AI tool directories
export async function scrapeAIToolDirectory(): Promise<ScrapedTool[]> {
  try {
    const response = await axios.get('https://theresanaiforthat.com/');
    const $ = cheerio.load(response.data);
    const tools: ScrapedTool[] = [];

    $('.tool-card').each((_, element) => {
      const name = $(element).find('.tool-name').text().trim();
      const description = $(element).find('.tool-description').text().trim();
      const category = $(element).find('.tool-category').text().trim() || 'AI';
      const url = $(element).find('a').attr('href') || '';
      const image_url = $(element).find('img').attr('src') || '';

      if (name && description) {
        tools.push({ name, description, category, url, image_url });
      }
    });

    return tools.slice(0, 50);
  } catch (error) {
    console.error('Scraping error:', error);
    return [];
  }
}

// Scrape GitHub AI repositories
export async function scrapeGitHubAI(): Promise<ScrapedTool[]> {
  try {
    const response = await axios.get('https://api.github.com/search/repositories?q=artificial+intelligence+OR+machine+learning&sort=stars&order=desc&per_page=30');
    
    return response.data.items.map((repo: any) => ({
      name: repo.name,
      description: repo.description || 'AI/ML repository',
      category: 'Development',
      url: repo.html_url,
      image_url: repo.owner.avatar_url
    }));
  } catch (error) {
    console.error('GitHub API error:', error);
    return [];
  }
}
```

### Create Scraping Server Actions
Add to `src/app/actions.ts`:
```typescript
import { scrapeProductHunt, scrapeAIToolDirectory, scrapeGitHubAI } from '@/lib/scrapers';

export async function scrapeAndAddTools(source: 'producthunt' | 'aitooldir' | 'github') {
  try {
    let scrapedTools = [];
    
    switch (source) {
      case 'producthunt':
        scrapedTools = await scrapeProductHunt();
        break;
      case 'aitooldir':
        scrapedTools = await scrapeAIToolDirectory();
        break;
      case 'github':
        scrapedTools = await scrapeGitHubAI();
        break;
    }

    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    let added = 0;

    for (const tool of scrapedTools) {
      try {
        // Check if tool already exists
        const { data: existing } = await supabase
          .from('tools')
          .select('id')
          .eq('name', tool.name)
          .single();

        if (existing) continue; // Skip if exists

        // Generate embedding
        const result = await model.embedContent(tool.description);
        const embedding = result.embedding.values;

        // Insert tool
        const { error } = await supabase.from('tools').insert({
          ...tool,
          embedding,
        });

        if (!error) added++;
      } catch (error) {
        console.error(`Error adding ${tool.name}:`, error);
      }
    }

    return { success: true, added, total: scrapedTools.length };
  } catch (error) {
    console.error('Scraping error:', error);
    return { success: false, error };
  }
}
```

## 3. Bulk Import System

### Create Import Interface
Create `src/app/import/page.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { bulkImportTools } from '../actions';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    const text = await file.text();
    
    try {
      const data = JSON.parse(text);
      const result = await bulkImportTools(data);
      setResult(result);
    } catch (error) {
      setResult({ success: false, error: 'Invalid JSON file' });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Bulk Import Tools</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Import from JSON</h2>
          <p className="text-gray-300 mb-4">
            Upload a JSON file with tool data. Format: [{"name": "...", "description": "...", "category": "...", "url": "...", "image_url": "..."}]
          </p>
          
          <input
            type="file"
            accept=".json"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-4 text-white"
          />
          
          <button
            onClick={handleImport}
            disabled={!file || loading}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Importing...' : 'Import Tools'}
          </button>

          {result && (
            <div className={`mt-4 p-4 rounded ${result.success ? 'bg-green-900' : 'bg-red-900'}`}>
              <p className="text-white">
                {result.success 
                  ? `Successfully imported ${result.added} tools` 
                  : `Error: ${result.error}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Add Bulk Import Action
Add to `src/app/actions.ts`:
```typescript
export async function bulkImportTools(tools: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    let added = 0;

    for (const tool of tools) {
      if (!tool.name || !tool.description) continue;

      try {
        const result = await model.embedContent(tool.description);
        const embedding = result.embedding.values;

        const { error } = await supabase.from('tools').insert({
          name: tool.name,
          description: tool.description,
          category: tool.category || 'Uncategorized',
          url: tool.url || '',
          image_url: tool.image_url || '',
          embedding,
        });

        if (!error) added++;
      } catch (error) {
        console.error(`Error importing ${tool.name}:`, error);
      }
    }

    return { success: true, added, total: tools.length };
  } catch (error) {
    console.error('Bulk import error:', error);
    return { success: false, error };
  }
}
```

## 4. Automated Scraping with Cron Jobs

### Create Scheduled Scraping
Create `src/lib/scheduler.ts`:
```typescript
import { scrapeAndAddTools } from '@/app/actions';

export async function runDailyScrapingJob() {
  console.log('Starting daily scraping job...');
  
  const sources = ['producthunt', 'aitooldir', 'github'] as const;
  
  for (const source of sources) {
    try {
      const result = await scrapeAndAddTools(source);
      console.log(`${source}: Added ${result.added} new tools`);
    } catch (error) {
      console.error(`Error scraping ${source}:`, error);
    }
    
    // Wait between sources to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log('Daily scraping job completed');
}
```

### Add API Route for Cron
Create `src/app/api/cron/scrape/route.ts`:
```typescript
import { runDailyScrapingJob } from '@/lib/scheduler';

export async function GET() {
  try {
    await runDailyScrapingJob();
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error }, { status: 500 });
  }
}
```

## 5. Data Sources & APIs

### Popular AI Tool APIs
```typescript
// Integrate with existing APIs
const dataSources = {
  productHunt: 'https://api.producthunt.com/v2/api/graphql',
  aiToolsDirectory: 'https://theresanaiforthat.com/api/tools',
  github: 'https://api.github.com/search/repositories',
  crunchbase: 'https://api.crunchbase.com/api/v4/',
  betalist: 'https://betalist.com/api/startups'
};
```

## 6. Quality Control & Validation

### Add Content Moderation
```typescript
export async function validateTool(tool: any) {
  // Check for required fields
  if (!tool.name || !tool.description) return false;
  
  // Validate URL format
  if (tool.url && !isValidUrl(tool.url)) return false;
  
  // Check for spam/duplicate content
  const existing = await supabase
    .from('tools')
    .select('id')
    .eq('name', tool.name)
    .single();
    
  if (existing.data) return false;
  
  return true;
}
```

## Usage Examples

### 1. Manual Addition
Visit `/admin` to manually add curated tools

### 2. Scraping
```typescript
// Scrape Product Hunt
await scrapeAndAddTools('producthunt');

// Scrape AI directories  
await scrapeAndAddTools('aitooldir');
```

### 3. Bulk Import
Upload JSON file at `/import` with tool data

### 4. Automated Collection
Set up cron job to hit `/api/cron/scrape` daily

This system provides multiple ways to populate your database with high-quality AI tool data while maintaining control over content quality.