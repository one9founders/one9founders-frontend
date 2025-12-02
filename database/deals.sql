-- Deals and offers table
CREATE TABLE deals (
  id BIGSERIAL PRIMARY KEY,
  tool_id BIGINT REFERENCES tools(id),
  offer_title TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  tool_short_desc TEXT NOT NULL,
  image_url TEXT NOT NULL,
  old_price DECIMAL(10,2),
  new_price DECIMAL(10,2),
  discount_percentage INTEGER,
  expiry_date DATE NOT NULL,
  claims_count INTEGER DEFAULT 0,
  offer_tag TEXT NOT NULL, -- e.g., "50% OFF", "LIMITED TIME", "EARLY BIRD"
  featured_deal BOOLEAN DEFAULT FALSE,
  deal_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_deals_active ON deals(is_active);
CREATE INDEX idx_deals_featured ON deals(featured_deal);
CREATE INDEX idx_deals_expiry ON deals(expiry_date);

-- Mock data
INSERT INTO deals (offer_title, tool_name, tool_short_desc, image_url, old_price, new_price, discount_percentage, expiry_date, claims_count, offer_tag, featured_deal, deal_url) VALUES
('Black Friday Special', 'ChatGPT Pro', 'Advanced AI conversation for businesses', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop', 40.00, 20.00, 50, '2024-12-31', 1234, '50% OFF', true, 'https://chat.openai.com/'),
('Annual Plan Discount', 'Midjourney', 'AI image generation platform', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop', 120.00, 96.00, 20, '2024-12-25', 567, '20% OFF', false, 'https://midjourney.com/'),
('Student Discount', 'Notion AI', 'Smart workspace with AI assistance', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop', 16.00, 8.00, 50, '2025-01-15', 892, 'STUDENT', true, 'https://notion.so/'),
('Early Bird Offer', 'GitHub Copilot', 'AI pair programming assistant', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', 10.00, 7.00, 30, '2024-12-20', 345, 'EARLY BIRD', false, 'https://github.com/features/copilot'),
('Limited Time Deal', 'Jasper AI', 'AI content creation platform', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop', 39.00, 19.50, 50, '2024-12-28', 678, 'LIMITED TIME', true, 'https://jasper.ai/');