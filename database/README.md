# Database Setup Instructions

## Quick Setup

1. **Copy the SQL schema**:
   - Open `schema.sql` in this directory
   - Copy all the SQL code

2. **Run in Supabase**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Paste the schema code
   - Click "Run" to execute

## What This Creates

### Core Tables
- `categories` - Tool categories (AI Assistant, Content Creation, etc.)
- `tools` - Main tools table with vector embeddings
- `users` - User accounts (for future features)
- `tool_reviews` - User reviews and ratings
- `user_favorites` - User saved tools
- `tool_submissions` - Community tool submissions

### Key Functions
- `match_tools()` - Semantic search with vector similarity
- `get_all_tools()` - Get tools with filtering and pagination

### Security
- Row Level Security (RLS) enabled
- Public read access for tools and categories
- Authenticated user policies for reviews and favorites

## After Running Schema

1. The database will have 12 default categories
2. Run your seed script to populate tools
3. Test semantic search functionality

## Database Features

- **Vector Search**: Uses pgvector for semantic similarity
- **Full-text Search**: Optimized indexes for performance  
- **User Management**: Ready for authentication features
- **Review System**: Ratings and reviews with auto-calculated averages
- **Admin Features**: Tool submission and approval workflow