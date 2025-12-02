# One9Founders - AI Tool Directory

An AI-powered directory platform for founders and startups to discover relevant AI tools through intelligent semantic search.

## Setup Instructions

### 1. Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Then update `.env.local` with your actual credentials:

#### Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Settings > API to find your credentials
3. Copy the Project URL and anon/public key

#### Google AI Studio Setup
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Copy the API key

### 2. Database Setup

Run the SQL schema files in your Supabase SQL editor:

1. First run `supabase_schema.sql` to create the tools table
2. Then run `supabase_reviews_schema.sql` to create the reviews system

### 3. Install Dependencies

```bash
npm install
```

### 4. Seed Database

Visit `/seed` in your browser to populate the database with initial AI tools.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Features

- 🔍 **Semantic Search**: AI-powered search using Google Gemini embeddings
- 📊 **Reviews & Ratings**: Complete review system with pros/cons
- 💰 **Pricing Information**: Detailed pricing models and free trials
- 🏷️ **Tags & Categories**: Comprehensive filtering and categorization
- 🎥 **Video Demos**: Embedded video demonstrations
- ⭐ **Verification System**: Verified and featured tool badges
- 📱 **Responsive Design**: Mobile-first responsive interface

## Pages

- `/` - Main directory with search and filtering
- `/about` - About the platform
- `/submit` - Submit new AI tools
- `/admin` - Admin panel for tool management
- `/tool/[id]` - Individual tool detail pages with reviews
- `/seed` - Database seeding utility

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI**: Google Gemini API (text-embedding-004)
- **Deployment**: Vercel (recommended)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `GOOGLE_API_KEY` | Your Google AI Studio API key | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.# one9founder-frontend
