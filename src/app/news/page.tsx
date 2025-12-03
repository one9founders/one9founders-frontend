'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import NewsCard from '../../components/NewsCard';
import NewsletterSignup from '../../components/NewsletterSignup';
import { getNews, NewsArticle } from '../../lib/newsService';

const categories = ['All', 'AI Tools', 'Tips & Tricks', 'Industry News', 'Tutorials', 'Reviews'];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const data = await getNews(selectedCategory);
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--gray-black)' }}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">News & Insights</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stay updated with the latest AI tools, tips, and industry insights for founders and entrepreneurs.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              style={selectedCategory === category ? { backgroundColor: 'var(--brand-primary)' } : {}}
            >
              {category}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-gray-400">Loading...</div>
          ) : (
            news.map((article) => (
              <NewsCard key={article.id} article={{
                ...article,
                readTime: article.read_time
              }} />
            ))
          )}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            Load More Articles
          </button>
        </div>
      </div>

      <NewsletterSignup />
      <Footer />
    </div>
  );
}