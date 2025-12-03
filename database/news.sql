-- Create news table
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date DATE NOT NULL,
  read_time TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO news (title, description, content, author, date, read_time, category, image) VALUES
(
  '10 AI Tools Every Startup Should Know About in 2024',
  'Discover the most powerful AI tools that can transform your startup''s productivity and growth potential.',
  '<p>The AI revolution is transforming how startups operate, offering unprecedented opportunities to automate tasks, enhance productivity, and scale operations efficiently. Here are the essential AI tools every startup founder should consider integrating into their workflow.</p><h2>1. ChatGPT for Content Creation</h2><p>OpenAI''s ChatGPT has become indispensable for content creation, customer support, and brainstorming. Startups are using it to generate marketing copy, draft emails, and even write code snippets.</p><h2>2. Notion AI for Documentation</h2><p>Notion AI transforms how teams create and organize documentation. It can summarize meetings, generate project plans, and help maintain consistent knowledge bases across your organization.</p><h2>3. Midjourney for Visual Content</h2><p>Creating professional visuals has never been easier. Midjourney enables startups to generate high-quality images for marketing materials, social media, and presentations without hiring expensive designers.</p><h2>4. Zapier AI for Automation</h2><p>Automate repetitive tasks across different platforms. Zapier AI can create complex workflows that save hours of manual work, allowing your team to focus on high-value activities.</p><h2>5. Grammarly for Communication</h2><p>Professional communication is crucial for startups. Grammarly ensures all your written communication is clear, error-free, and maintains a professional tone.</p>',
  'Sarah Chen',
  '2024-01-15',
  '5 min read',
  'AI Tools',
  '/api/placeholder/400/250'
),
(
  'How to Implement ChatGPT API in Your SaaS Product',
  'Step-by-step guide to integrating OpenAI''s ChatGPT API into your application with best practices.',
  '<p>Integrating ChatGPT API into your SaaS product can dramatically enhance user experience and provide intelligent automation capabilities.</p><h2>Getting Started</h2><p>First, you''ll need to obtain an API key from OpenAI and set up your development environment.</p><h2>Implementation Steps</h2><p>Follow these key steps to successfully integrate the API into your application.</p>',
  'Mike Rodriguez',
  '2024-01-12',
  '8 min read',
  'Tutorials',
  '/api/placeholder/400/250'
),
(
  '5 Productivity Hacks Using AI That Will Save You Hours',
  'Learn practical AI-powered productivity techniques that successful founders use daily.',
  '<p>AI-powered productivity tools are revolutionizing how entrepreneurs manage their time and tasks.</p><h2>Hack 1: Automated Email Responses</h2><p>Use AI to draft and send routine email responses automatically.</p><h2>Hack 2: Smart Calendar Management</h2><p>Let AI optimize your schedule based on priorities and energy levels.</p>',
  'Emma Thompson',
  '2024-01-10',
  '4 min read',
  'Tips & Tricks',
  '/api/placeholder/400/250'
),
(
  'The Rise of AI Agents: What Founders Need to Know',
  'Understanding the latest trends in AI agents and how they''re reshaping business automation.',
  '<p>AI agents are becoming increasingly sophisticated, offering new opportunities for business automation and customer service.</p><h2>What Are AI Agents?</h2><p>AI agents are autonomous systems that can perform tasks and make decisions on behalf of users.</p>',
  'David Park',
  '2024-01-08',
  '6 min read',
  'Industry News',
  '/api/placeholder/400/250'
),
(
  'Midjourney vs DALL-E 3: Complete Comparison for Creators',
  'In-depth comparison of the two leading AI image generation tools for creative professionals.',
  '<p>Both Midjourney and DALL-E 3 offer powerful image generation capabilities, but each has unique strengths.</p><h2>Midjourney Strengths</h2><p>Exceptional artistic quality and community features.</p><h2>DALL-E 3 Advantages</h2><p>Better text integration and ChatGPT compatibility.</p>',
  'Lisa Wang',
  '2024-01-05',
  '7 min read',
  'Reviews',
  '/api/placeholder/400/250'
),
(
  'Building Your First AI Chatbot: A Founder''s Guide',
  'Complete tutorial on creating an AI chatbot for your business without coding experience.',
  '<p>Creating an AI chatbot for your business doesn''t require extensive coding knowledge.</p><h2>Choosing the Right Platform</h2><p>Select a platform that matches your technical skills and business needs.</p><h2>Design Considerations</h2><p>Focus on user experience and clear conversation flows.</p>',
  'Alex Johnson',
  '2024-01-03',
  '10 min read',
  'Tutorials',
  '/api/placeholder/400/250'
);

-- Create RLS policies
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON news
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update (for admin)
CREATE POLICY "Allow authenticated insert" ON news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON news
  FOR UPDATE USING (auth.role() = 'authenticated');