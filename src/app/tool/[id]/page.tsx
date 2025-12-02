'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Review } from '@/types';
import { getReviewsForTool } from '@/app/reviews/actions';
import ReviewForm from '@/components/ReviewForm';
import ReviewsList from '@/components/ReviewsList';

export default function ToolDetailPage() {
  const params = useParams();
  const toolId = parseInt(params.id as string);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [toolId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const reviewsData = await getReviewsForTool(toolId);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = () => {
    setShowReviewForm(false);
    loadReviews();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--gray-black)' }}>
      <nav className="px-6 py-4" style={{ backgroundColor: 'var(--gray-black)', borderBottom: '1px solid var(--gray-800)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-8" draggable={false} />
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white">
            ← Back to Directory
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Reviews ({reviews.length})
          </h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="py-2 px-4 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}
          >
            Write Review
          </button>
        </div>

        {showReviewForm && (
          <div className="mb-8">
            <ReviewForm 
              toolId={toolId} 
              toolName={`Tool ${toolId}`} 
              onReviewAdded={handleReviewAdded} 
            />
          </div>
        )}

        {loading ? (
          <div className="text-center text-white">Loading reviews...</div>
        ) : (
          <ReviewsList reviews={reviews} />
        )}
      </div>
    </div>
  );
}