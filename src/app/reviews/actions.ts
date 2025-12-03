'use server';

import { reviewsAPI } from '@/lib/apiClient';

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
    await reviewsAPI.create(reviewData);
    return { success: true };
  } catch (error) {
    console.error('Add review error:', error);
    return { success: false, error };
  }
}

export async function getReviewsForTool(toolId: number) {
  try {
    return await reviewsAPI.getByToolId(toolId);
  } catch (error) {
    console.error('Get reviews error:', error);
    return [];
  }
}