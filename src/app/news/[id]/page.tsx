'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { getNewsById, NewsArticle } from '../../../lib/newsService';

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await getNewsById(id);
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--gray-black)' }}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="text-white">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--gray-black)' }}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl text-white">Article not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--gray-black)' }}>
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <span className="text-white text-sm px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--brand-primary)' }}>
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">{article.title}</h1>
          <div className="flex items-center text-gray-400 text-sm space-x-4">
            <span>By {article.author}</span>
            <span>•</span>
            <span>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span>{article.read_time}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0zNTAgMTc1SDQ1MFYyMjVIMzUwVjE3NVoiIGZpbGw9IiM2QjcyODAiLz4KPHA+';
            }}
          />
        </div>

        {/* Content */}
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        <style jsx global>{`
          .article-content {
            color: rgb(209 213 219);
            line-height: 1.7;
          }
          .article-content h1 {
            color: white;
            font-size: 2rem;
            font-weight: 700;
            margin: 2rem 0 1rem 0;
          }
          .article-content h2 {
            color: white;
            font-size: 1.5rem;
            font-weight: 600;
            margin: 2rem 0 1rem 0;
          }
          .article-content h3 {
            color: white;
            font-size: 1.25rem;
            font-weight: 600;
            margin: 1.5rem 0 0.5rem 0;
          }
          .article-content p {
            margin: 1rem 0;
            color: rgb(209 213 219);
          }
          .article-content ul, .article-content ol {
            margin: 1rem 0;
            padding-left: 1.5rem;
          }
          .article-content li {
            margin: 0.5rem 0;
          }
        `}</style>
      </article>

      <Footer />
    </div>
  );
}