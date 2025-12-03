import { newsAPI } from './apiClient';

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
  const data = await newsAPI.getAll();
  
  if (category && category !== 'All') {
    return data.filter((article: NewsArticle) => article.category === category);
  }
  
  return data as NewsArticle[];
}

export async function getNewsById(id: string) {
  const data = await newsAPI.getById(parseInt(id));
  return data as NewsArticle;
}