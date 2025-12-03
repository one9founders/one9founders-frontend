import { supabase } from './supabaseClient';

export interface NewsArticle {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  date: string;
  read_time: string;
  category: string;
  image: string;
}

export async function getNews(category?: string) {
  let query = supabase.from('news').select('*').order('date', { ascending: false });
  
  if (category && category !== 'All') {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as NewsArticle[];
}

export async function getNewsById(id: string) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as NewsArticle;
}