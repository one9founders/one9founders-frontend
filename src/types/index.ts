export interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  url: string;
  image_url: string;
  similarity?: number;
  pricing_model?: 'Free' | 'Freemium' | 'Paid' | 'Free Trial';
  pricing_from?: number;
  billing_frequency?: 'Monthly' | 'Yearly' | 'One-time' | 'Usage-based';
  free_trial_days?: number;
  tags?: string[];
  video_demo_url?: string;
  rating?: number;
  review_count?: number;
  verified?: boolean;
  featured?: boolean;
  launch_date?: string;
  company_size?: 'Solo' | 'Small Team' | 'Medium' | 'Enterprise';
  integrations?: string[];
  use_cases?: string[];
}

export interface Review {
  id: number;
  tool_id: number;
  user_name: string;
  user_email?: string;
  rating: number;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  use_case?: string;
  company_size?: 'Solo' | 'Small Team' | 'Medium' | 'Enterprise';
  verified_purchase?: boolean;
  helpful_count?: number;
  created_at: string;
  updated_at?: string;
}
