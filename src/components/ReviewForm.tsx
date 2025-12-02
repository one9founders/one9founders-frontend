'use client';

import { useState } from 'react';
import { addReview } from '@/app/reviews/actions';
import { showSuccess, showError } from '@/lib/sweetAlert';

interface ReviewFormProps {
  toolId: number;
  toolName: string;
  onReviewAdded: () => void;
}

export default function ReviewForm({ toolId, toolName, onReviewAdded }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    rating: 5,
    title: '',
    comment: '',
    pros: '',
    cons: '',
    use_case: '',
    company_size: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const companySizes = ['Solo', 'Small Team', 'Medium', 'Enterprise'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user_name || !formData.title || !formData.comment) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const reviewData = {
        tool_id: toolId,
        user_name: formData.user_name,
        user_email: formData.user_email || undefined,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        pros: formData.pros ? formData.pros.split(',').map(p => p.trim()) : [],
        cons: formData.cons ? formData.cons.split(',').map(c => c.trim()) : [],
        use_case: formData.use_case || undefined,
        company_size: formData.company_size || undefined
      };

      const result = await addReview(reviewData);
      
      if (result.success) {
        await showSuccess('Success!', 'Review submitted successfully!');
        setFormData({
          user_name: '',
          user_email: '',
          rating: 5,
          title: '',
          comment: '',
          pros: '',
          cons: '',
          use_case: '',
          company_size: ''
        });
        onReviewAdded();
      } else {
        await showError('Error', 'Failed to submit review. Please try again.');
      }
    } catch (error) {
      await showError('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--gray-900)', border: '1px solid var(--gray-800)' }}>
      <h3 className="text-xl font-bold text-white mb-4">Write a Review for {toolName}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Name *</label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Rating *</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className={`text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-600'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Review Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Great tool for..."
            className="w-full px-3 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Review *</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={4}
            placeholder="Share your experience with this tool..."
            className="w-full px-3 py-2 rounded-lg resize-vertical"
            style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Pros</label>
            <input
              type="text"
              name="pros"
              value={formData.pros}
              onChange={handleChange}
              placeholder="Easy to use, Great support"
              className="w-full px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Cons</label>
            <input
              type="text"
              name="cons"
              value={formData.cons}
              onChange={handleChange}
              placeholder="Expensive, Limited features"
              className="w-full px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Use Case</label>
            <input
              type="text"
              name="use_case"
              value={formData.use_case}
              onChange={handleChange}
              placeholder="Content creation, Marketing"
              className="w-full px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Company Size</label>
            <select
              name="company_size"
              value={formData.company_size}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
            >
              <option value="">Select size</option>
              {companySizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
          style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}