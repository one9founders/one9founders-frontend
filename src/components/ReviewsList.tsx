'use client';

import { Review } from '@/types';

interface ReviewsListProps {
  reviews: Review[];
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
    ));
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No reviews yet. Be the first to review this tool!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg p-6" style={{ backgroundColor: 'var(--gray-900)', border: '1px solid var(--gray-800)' }}>
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white">{review.user_name}</span>
                {review.verified_purchase && (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-600 text-white">
                    Verified
                  </span>
                )}
                {review.company_size && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                    {review.company_size}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">{getRatingStars(review.rating)}</div>
                <span className="text-sm text-gray-400">{formatDate(review.created_at)}</span>
              </div>
            </div>
            {review.helpful_count && review.helpful_count > 0 && (
              <div className="text-sm text-gray-400">
                {review.helpful_count} found helpful
              </div>
            )}
          </div>

          {/* Title */}
          <h4 className="text-lg font-semibold text-white mb-2">{review.title}</h4>

          {/* Comment */}
          <p className="text-gray-300 mb-4 leading-relaxed">{review.comment}</p>

          {/* Pros and Cons */}
          {(review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {review.pros && review.pros.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-green-400 mb-2">Pros:</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {review.pros.map((pro, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-400 mr-2">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {review.cons && review.cons.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-red-400 mb-2">Cons:</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {review.cons.map((con, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-400 mr-2">-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}

          {/* Use Case */}
          {review.use_case && (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-400">Use case: </span>
              <span className="text-sm text-gray-300">{review.use_case}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-800">
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              👍 Helpful ({review.helpful_count || 0})
            </button>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              Reply
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}