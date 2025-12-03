import Link from 'next/link';

interface NewsArticle {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Link href={`/news/${article.id}`}>
      <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
        {/* Image */}
        <div className="aspect-video bg-gray-800 relative">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDIyNVYxNTBIMTc1VjEwMFoiIGZpbGw9IiM2QjcyODAiLz4KPHBhdGggZD0iTTE1MCA3NUgyNTBWMTc1SDE1MFY3NVoiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkFJIE5ld3M8L3RleHQ+Cjwvc3ZnPgo=';
            }}
          />
          <div className="absolute top-3 left-3">
            <span className="text-white text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--brand-primary)' }}>
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {article.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <span>{article.author}</span>
              <span>•</span>
              <span>{formatDate(article.date)}</span>
            </div>
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}