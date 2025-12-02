-- One9Founders Database Schema
-- Complete database setup from scratch

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS tool_submissions CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS tool_reviews CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tools CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tools table (main table)
CREATE TABLE tools (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  category_id BIGINT REFERENCES categories(id),
  url TEXT,
  image_url TEXT,
  pricing TEXT DEFAULT 'Unknown',
  pricing_model TEXT,
  pricing_from DECIMAL(10,2),
  billing_frequency TEXT DEFAULT 'Unknown',
  free_trial_days INTEGER,
  tags TEXT[],
  video_demo_url TEXT,
  use_cases TEXT[],
  rating DECIMAL(2,1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  launch_date DATE,
  company_size TEXT,
  integrations TEXT[],
  embedding VECTOR(768), -- Google's text-embedding-004 dimensions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (for future features)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tool_reviews table
CREATE TABLE tool_reviews (
  id BIGSERIAL PRIMARY KEY,
  tool_id BIGINT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_favorites table
CREATE TABLE user_favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_id BIGINT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- Create tool_submissions table (for community submissions)
CREATE TABLE tool_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  category_name TEXT,
  submitter_email TEXT,
  submitter_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table (referenced in reviews actions)
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  tool_id BIGINT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  pros TEXT[],
  cons TEXT[],
  use_case TEXT,
  company_size TEXT,
  verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_tools_embedding ON tools USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_tools_category_id ON tools(category_id);
CREATE INDEX idx_tools_is_active ON tools(is_active);
CREATE INDEX idx_tools_is_featured ON tools(is_featured);
CREATE INDEX idx_tools_rating ON tools(rating DESC);
CREATE INDEX idx_tools_company_size ON tools(company_size);
CREATE INDEX idx_tool_reviews_tool_id ON tool_reviews(tool_id);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_tool_id ON user_favorites(tool_id);
CREATE INDEX idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);

-- Drop ALL existing functions with specific signatures to avoid overloading conflicts
DROP FUNCTION IF EXISTS match_tools(vector, double precision, integer, text) CASCADE;
DROP FUNCTION IF EXISTS match_tools(vector, double precision, integer) CASCADE;
DROP FUNCTION IF EXISTS match_tools(vector) CASCADE;
DROP FUNCTION IF EXISTS get_all_tools(integer, integer, text, boolean) CASCADE;
DROP FUNCTION IF EXISTS get_all_tools() CASCADE;

-- Create the semantic search function
CREATE OR REPLACE FUNCTION match_tools (
  query_embedding VECTOR(768),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 10,
  category_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  id BIGINT,
  name TEXT,
  description TEXT,
  category TEXT,
  category_name TEXT,
  url TEXT,
  image_url TEXT,
  pricing TEXT,
  pricing_model TEXT,
  pricing_from DECIMAL,
  billing_frequency TEXT,
  free_trial_days INTEGER,
  tags TEXT[],
  video_demo_url TEXT,
  use_cases TEXT[],
  rating DECIMAL,
  review_count INTEGER,
  verified BOOLEAN,
  featured BOOLEAN,
  is_featured BOOLEAN,
  launch_date DATE,
  company_size TEXT,
  integrations TEXT[],
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    t.description,
    t.category,
    c.name as category_name,
    t.url,
    t.image_url,
    t.pricing,
    t.pricing_model,
    t.pricing_from,
    t.billing_frequency,
    t.free_trial_days,
    t.tags,
    t.video_demo_url,
    t.use_cases,
    t.rating,
    t.review_count,
    t.verified,
    t.featured,
    t.is_featured,
    t.launch_date,
    t.company_size,
    t.integrations,
    1 - (t.embedding <=> query_embedding) AS similarity
  FROM tools t
  LEFT JOIN categories c ON t.category_id = c.id
  WHERE 
    t.is_active = TRUE
    AND t.embedding IS NOT NULL
    AND 1 - (t.embedding <=> query_embedding) > match_threshold
    AND (category_filter IS NULL OR c.slug = category_filter)
  ORDER BY t.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create function to get all tools with category info
CREATE OR REPLACE FUNCTION get_all_tools(
  limit_count INT DEFAULT 50,
  offset_count INT DEFAULT 0,
  category_filter TEXT DEFAULT NULL,
  featured_only BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  id BIGINT,
  name TEXT,
  description TEXT,
  category TEXT,
  category_name TEXT,
  url TEXT,
  image_url TEXT,
  pricing TEXT,
  pricing_model TEXT,
  pricing_from DECIMAL,
  billing_frequency TEXT,
  free_trial_days INTEGER,
  tags TEXT[],
  video_demo_url TEXT,
  use_cases TEXT[],
  rating DECIMAL,
  review_count INTEGER,
  verified BOOLEAN,
  featured BOOLEAN,
  is_featured BOOLEAN,
  launch_date DATE,
  company_size TEXT,
  integrations TEXT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    t.description,
    t.category,
    c.name as category_name,
    t.url,
    t.image_url,
    t.pricing,
    t.pricing_model,
    t.pricing_from,
    t.billing_frequency,
    t.free_trial_days,
    t.tags,
    t.video_demo_url,
    t.use_cases,
    t.rating,
    t.review_count,
    t.verified,
    t.featured,
    t.is_featured,
    t.launch_date,
    t.company_size,
    t.integrations
  FROM tools t
  LEFT JOIN categories c ON t.category_id = c.id
  WHERE 
    t.is_active = TRUE
    AND (category_filter IS NULL OR c.slug = category_filter)
    AND (featured_only = FALSE OR t.is_featured = TRUE)
  ORDER BY t.is_featured DESC, t.rating DESC, t.name ASC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- Insert default categories
INSERT INTO categories (name, description, slug) VALUES
('AI Assistant', 'Conversational AI and chatbots', 'ai-assistant'),
('Content Creation', 'AI tools for writing, copywriting, and content generation', 'content-creation'),
('Image Generation', 'AI-powered image and art creation tools', 'image-generation'),
('Video & Audio', 'AI tools for video editing, audio processing, and multimedia', 'video-audio'),
('Productivity', 'AI-enhanced productivity and workflow tools', 'productivity'),
('Development', 'AI coding assistants and development tools', 'development'),
('Design', 'AI-powered design and creative tools', 'design'),
('Marketing', 'AI tools for marketing, SEO, and social media', 'marketing'),
('Analytics', 'AI-driven data analysis and business intelligence', 'analytics'),
('Customer Service', 'AI chatbots and customer support tools', 'customer-service'),
('Education', 'AI tools for learning and education', 'education'),
('Healthcare', 'AI applications in healthcare and wellness', 'healthcare');

-- Enable Row Level Security (RLS) for security
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for tools" ON tools FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can insert tools" ON tools FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON tools TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON tool_reviews TO authenticated;
GRANT INSERT, UPDATE, DELETE ON user_favorites TO authenticated;
GRANT INSERT ON tool_submissions TO anon, authenticated;
GRANT INSERT, SELECT ON reviews TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;