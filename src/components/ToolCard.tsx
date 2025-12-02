'use client';

import { Tool } from '@/types';
import { useState } from 'react';
import Link from 'next/link';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const [showVideo, setShowVideo] = useState(false);

  const getPricingDisplay = () => {
    if (tool.pricing_model === 'Free') return 'Free';
    if (tool.pricing_model === 'Free Trial') {
      return `${tool.free_trial_days || 7} days free trial`;
    }
    if (tool.pricing_from) {
      const frequency = tool.billing_frequency === 'Monthly' ? '/mo' : 
                       tool.billing_frequency === 'Yearly' ? '/yr' : '';
      return `From $${tool.pricing_from}${frequency}`;
    }
    return tool.pricing_model || 'Contact for pricing';
  };

  const getRatingStars = () => {
    if (!tool.rating) return null;
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < tool.rating! ? 'text-yellow-400' : 'text-gray-600'}>★</span>
    ));
  };

  return (
    <div className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group" 
         style={{ backgroundColor: 'var(--gray-900)', border: '1px solid var(--gray-800)' }}>
      
      {/* Image/Video Section */}
      <div className="relative">
        {showVideo && tool.video_demo_url ? (
          <div className="w-full h-48 bg-black">
            <iframe
              src={tool.video_demo_url}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative">
            <img src={tool.image_url} alt={tool.name} className="w-full h-48 object-cover" />
            {tool.video_demo_url && (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </button>
            )}
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {tool.featured && (
            <span className="px-2 py-1 text-xs rounded-full bg-yellow-500 text-black font-medium">
              Featured
            </span>
          )}
          {tool.verified && (
            <span className="px-2 py-1 text-xs rounded-full bg-blue-500 text-white font-medium">
              Verified
            </span>
          )}
        </div>

        {/* Pricing Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs rounded-full font-medium"
                style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>
            {getPricingDisplay()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <span className="inline-block px-3 py-1 text-sm rounded-full" 
                style={{ backgroundColor: 'var(--brand-light)', color: 'var(--brand-primary)' }}>
            {tool.category}
          </span>
          {tool.similarity && (
            <span className="text-sm text-green-400">
              {Math.min(Math.round(tool.similarity * 100), 100)}% match
            </span>
          )}
        </div>

        {/* Title and Rating */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-white">{tool.name}</h3>
          {tool.rating && (
            <div className="flex items-center gap-1">
              <div className="flex">{getRatingStars()}</div>
              <span className="text-sm text-gray-400">({tool.review_count || 0})</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--gray-500)' }}>
          {tool.description}
        </p>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tool.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                {tag}
              </span>
            ))}
            {tool.tags.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                +{tool.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Use Cases */}
        {tool.use_cases && tool.use_cases.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-1">Use cases:</p>
            <p className="text-sm text-gray-300">{tool.use_cases.slice(0, 2).join(', ')}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/tool/${tool.id}`}
            className="flex-1 text-center py-2 px-4 rounded-lg font-medium transition-colors bg-gray-700 text-white hover:bg-gray-600"
          >
            View Details
          </Link>
          {tool.url && (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 px-4 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}
            >
              Visit Tool
            </a>
          )}
        </div>
      </div>
    </div>
  );
}