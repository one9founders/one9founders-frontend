'use server';

import { supabase } from '@/lib/supabaseClient';

export async function addReview(reviewData: {
  tool_id: number;
  user_name: string;
  user_email?: string;
  rating: number;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  use_case?: string;
  company_size?: string;
}) {
  try {
    const { error } = await supabase.from('reviews').insert({
      ...reviewData,
      pros: reviewData.pros || [],
      cons: reviewData.cons || [],
      verified_purchase: false,
      helpful_count: 0
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Add review error:', error);
    return { success: false, error };
  }
}

export async function getReviewsForTool(toolId: number) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get reviews error:', error);
    return [];
  }
}