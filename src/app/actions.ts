'use server';

import { toolsAPI, dealsAPI, newsletterAPI } from '@/lib/apiClient';

export async function searchTools(query: string) {
  if (!query) return [];
  try {
    return await toolsAPI.search(query);
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

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
    await toolsAPI.create(toolData);
    return { success: true };
  } catch (error) {
    console.error('Add tool error:', error);
    return { success: false, error };
  }
}

export async function updateTool(id: number, toolData: {
  name: string;
  description: string;
  category: string;
  url: string;
  image_url: string;
}) {
  try {
    await toolsAPI.update(id, toolData);
    return { success: true };
  } catch (error) {
    console.error('Update tool error:', error);
    return { success: false, error };
  }
}

export async function getAllTools() {
  try {
    return await toolsAPI.getAll();
  } catch (error) {
    console.error('Get tools error:', error);
    return [];
  }
}

export async function getToolById(id: number) {
  try {
    return await toolsAPI.getById(id);
  } catch (error) {
    console.error('Get tool error:', error);
    return null;
  }
}

export async function deleteTool(id: number) {
  try {
    await toolsAPI.delete(id);
    return { success: true };
  } catch (error) {
    console.error('Delete tool error:', error);
    return { success: false, error };
  }
}

export async function bulkImportTools(tools: any[]) {
  try {
    let added = 0;
    for (const tool of tools) {
      if (!tool.name || !tool.description) continue;
      try {
        await toolsAPI.create(tool);
        added++;
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
  return { success: false, error: 'Use Django backend seed_data.py instead' };
}

export async function subscribeToNewsletter(email: string) {
  try {
    await newsletterAPI.subscribe(email);
    return { success: true };
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return { success: false, error: error.message || 'Failed to subscribe' };
  }
}

export async function getAllDeals() {
  try {
    return await dealsAPI.getAll();
  } catch (error) {
    console.error('Get deals error:', error);
    return [];
  }
}

export async function seedDeals() {
  return { success: false, error: 'Use Django backend seed_data.py instead' };
}
