'use server';

import { genAI } from '@/lib/geminiClient';
import { supabase } from '@/lib/supabaseClient';

export async function searchTools(query: string) {
  if (!query) return [];

  try {
    // 1. First try exact name match for better tool name detection
    const { data: exactMatches, error: exactError } = await supabase
      .from('tools')
      .select('*')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .limit(5);

    // 2. Generate embedding for semantic search
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(query);
    const embedding = result.embedding.values;

    // 3. Semantic search using match_tools RPC function
    const { data: semanticMatches, error } = await supabase.rpc('match_tools', {
      query_embedding: embedding,
      match_threshold: 0.3, // Lower threshold for better recall
      match_count: 10,
    });

    if (error) {
      console.error('Supabase search error:', error);
      return exactMatches || [];
    }

    // 4. Combine and deduplicate results, prioritizing exact matches
    const exactIds = new Set((exactMatches || []).map((tool: any) => tool.id));
    const combinedResults = [
      ...(exactMatches || []).map((tool: any) => ({ ...tool, similarity: 10.0 })), // Much higher score for exact matches
      ...(semanticMatches || []).filter((tool: any) => !exactIds.has(tool.id))
    ];

    // 5. Sort by similarity score (highest first)
    return combinedResults
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
      .slice(0, 10);
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Add single tool to database
export async function addTool(toolData: {
  name: string;
  description: string;
  category: string;
  url: string;
  image_url: string;
  pricing_model?: string;
  pricing_from?: number;
  billing_frequency?: string;
  free_trial_days?: number;
  tags?: string[];
  video_demo_url?: string;
  use_cases?: string[];
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const searchableText = `${toolData.name} - ${toolData.description}`;
    const result = await model.embedContent(searchableText);
    const embedding = result.embedding.values;

    const { error } = await supabase.from('tools').insert({
      ...toolData,
      embedding,
      tags: toolData.tags || [],
      use_cases: toolData.use_cases || [],
      rating: 4.5, // Default rating
      review_count: Math.floor(Math.random() * 100) + 10, // Random review count
      verified: false,
      featured: false,
      launch_date: new Date().toISOString().split('T')[0]
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Add tool error:', error);
    return { success: false, error };
  }
}

// Update existing tool
export async function updateTool(id: number, toolData: {
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

    const { error } = await supabase
      .from('tools')
      .update({ ...toolData, embedding })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Update tool error:', error);
    return { success: false, error };
  }
}

// Get all tools for admin
export async function getAllTools() {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get tools error:', error);
    return [];
  }
}

// Get single tool by ID
export async function getToolById(id: number) {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get tool error:', error);
    return null;
  }
}

// Delete tool
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

// Bulk import tools
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

export async function seedDatabase() {
  const portfolioData = [
    { 
      name: "ChatGPT", 
      description: "AI-powered conversational assistant for content creation, coding, and problem-solving", 
      category: "AI", 
      url: "https://chat.openai.com", 
      image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop",
      pricing_model: "Freemium",
      pricing_from: 20,
      billing_frequency: "Monthly",
      tags: ["conversational AI", "content creation", "coding assistant"],
      use_cases: ["content writing", "code generation", "customer support"],
      rating: 4.8,
      review_count: 2847,
      verified: true,
      featured: true
    },
    { 
      name: "Midjourney", 
      description: "AI image generation platform for creating stunning visual content", 
      category: "AI", 
      url: "https://midjourney.com", 
      image_url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=200&fit=crop",
      pricing_model: "Paid",
      pricing_from: 10,
      billing_frequency: "Monthly",
      tags: ["image generation", "art creation", "design"],
      use_cases: ["marketing visuals", "social media content", "concept art"],
      rating: 4.7,
      review_count: 1923,
      verified: true,
      featured: true
    },
    { 
      name: "Notion AI", 
      description: "Smart workspace combining notes, tasks, and AI-powered assistance", 
      category: "Productivity", 
      url: "https://notion.so", 
      image_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop",
      pricing_model: "Freemium",
      pricing_from: 8,
      billing_frequency: "Monthly",
      tags: ["workspace", "note-taking", "project management"],
      use_cases: ["team collaboration", "documentation", "task management"],
      rating: 4.6,
      review_count: 3421,
      verified: true
    },
    { 
      name: "Figma AI", 
      description: "Design collaboration platform with AI-powered design assistance", 
      category: "Design", 
      url: "https://figma.com", 
      image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop",
      pricing_model: "Freemium",
      pricing_from: 12,
      billing_frequency: "Monthly",
      tags: ["design", "collaboration", "prototyping"],
      use_cases: ["UI/UX design", "team collaboration", "prototyping"],
      rating: 4.9,
      review_count: 5672,
      verified: true,
      featured: true
    },
    { 
      name: "GitHub Copilot", 
      description: "AI pair programming assistant that helps write code faster", 
      category: "Development", 
      url: "https://github.com/features/copilot", 
      image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
      pricing_model: "Paid",
      pricing_from: 10,
      billing_frequency: "Monthly",
      tags: ["code completion", "programming", "AI assistant"],
      use_cases: ["code generation", "debugging", "learning programming"],
      rating: 4.5,
      review_count: 8934,
      verified: true
    },
    { 
      name: "Jasper AI", 
      description: "AI content creation platform for marketing and business content", 
      category: "Content", 
      url: "https://jasper.ai", 
      image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop",
      pricing_model: "Free Trial",
      free_trial_days: 7,
      pricing_from: 39,
      billing_frequency: "Monthly",
      tags: ["content creation", "marketing", "copywriting"],
      use_cases: ["blog writing", "ad copy", "social media content"],
      rating: 4.4,
      review_count: 2156,
      verified: true
    },
    { 
      name: "Loom AI", 
      description: "Video messaging platform with AI-powered transcription and summaries", 
      category: "Video", 
      url: "https://loom.com", 
      image_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=300&h=200&fit=crop",
      pricing_model: "Freemium",
      pricing_from: 8,
      billing_frequency: "Monthly",
      tags: ["video messaging", "screen recording", "transcription"],
      use_cases: ["team communication", "tutorials", "feedback"],
      rating: 4.6,
      review_count: 1834,
      verified: true
    },
    { 
      name: "Grammarly", 
      description: "AI writing assistant for grammar, spelling, and style improvement", 
      category: "Writing", 
      url: "https://grammarly.com", 
      image_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop",
      pricing_model: "Freemium",
      pricing_from: 12,
      billing_frequency: "Monthly",
      tags: ["grammar check", "writing assistant", "proofreading"],
      use_cases: ["email writing", "document editing", "content improvement"],
      rating: 4.7,
      review_count: 12847,
      verified: true,
      featured: true
    },
  ];

  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    for (const tool of portfolioData) {
      const searchableText = `${tool.name} - ${tool.description}`;
      const result = await model.embedContent(searchableText);
      const embedding = result.embedding.values;

      const { error } = await supabase.from('tools').insert({
        name: tool.name,
        description: tool.description,
        category: tool.category,
        url: tool.url,
        image_url: tool.image_url,
        embedding,
        pricing_model: tool.pricing_model,
        pricing_from: tool.pricing_from,
        billing_frequency: tool.billing_frequency,
        free_trial_days: tool.free_trial_days,
        tags: tool.tags || [],
        use_cases: tool.use_cases || [],
        rating: tool.rating || 4.5,
        review_count: tool.review_count || Math.floor(Math.random() * 100) + 10,
        verified: tool.verified || false,
        featured: tool.featured || false,
        launch_date: new Date().toISOString().split('T')[0]
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

// Newsletter subscription
export async function subscribeToNewsletter(email: string) {
  try {
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert({ email, source: 'homepage' });

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'Email already subscribed' };
      }
      throw error;
    }

    // Send welcome email
    try {
      const { sendWelcomeEmail } = await import('@/lib/emailService');
      await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    return { success: true };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { success: false, error: 'Failed to subscribe' };
  }
}

// Get all active deals
export async function getAllDeals() {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('is_active', true)
      .order('featured_deal', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase deals error:', error);
      throw error;
    }
    console.log('Deals data:', data);
    return data || [];
  } catch (error) {
    console.error('Get deals error:', error);
    return [];
  }
}

// Seed deals data
export async function seedDeals() {
  const dealsData = [
    {
      tool_name: "ChatGPT Pro",
      offer_title: "Black Friday Special",
      tool_short_desc: "Advanced AI conversation for businesses",
      image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
      old_price: 40,
      new_price: 20,
      discount_percentage: 50,
      expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      claims_count: 1234,
      offer_tag: "50% OFF",
      featured_deal: true,
      deal_url: "https://chat.openai.com/"
    },
    {
      tool_name: "Midjourney",
      offer_title: "Annual Plan Discount",
      tool_short_desc: "AI image generation platform",
      image_url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
      old_price: 120,
      new_price: 96,
      discount_percentage: 20,
      expiry_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      claims_count: 567,
      offer_tag: "20% OFF",
      featured_deal: false,
      deal_url: "https://midjourney.com/"
    },
    {
      tool_name: "Notion AI",
      offer_title: "Student Discount",
      tool_short_desc: "Smart workspace with AI assistance",
      image_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      old_price: 16,
      new_price: 8,
      discount_percentage: 50,
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      claims_count: 892,
      offer_tag: "STUDENT",
      featured_deal: true,
      deal_url: "https://notion.so/"
    }
  ];

  try {
    for (const deal of dealsData) {
      const { error } = await supabase.from('deals').insert(deal);
      if (error) {
        console.error(`Error inserting deal ${deal.tool_name}:`, error);
      } else {
        console.log(`Inserted deal for ${deal.tool_name}`);
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Seed deals error:', error);
    return { success: false, error };
  }
}
