'use client';

import { Deal } from '@/types/deal';

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const getDaysLeft = () => {
    const today = new Date();
    const expiry = new Date(deal.expiry_date);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft();
  const isExpired = daysLeft <= 0;

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
      deal.featured_deal 
        ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-blue-400' 
        : 'bg-gray-900 border border-gray-800'
    }`}>
      
      {/* Header */}
      <div className="relative">
        {deal.featured_deal && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-sm font-medium">⭐ Featured Deal</span>
          </div>
        )}
        
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {deal.offer_tag}
          </span>
        </div>

        <img
          src={deal.image_url}
          alt={deal.tool_name}
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Content */}
      <div className={`p-6 ${deal.featured_deal ? 'text-white' : ''}`}>
        <h3 className={`text-2xl font-bold mb-2 ${deal.featured_deal ? 'text-white' : 'text-white'}`}>
          {deal.tool_name}
        </h3>
        
        <p className={`text-sm mb-2 ${deal.featured_deal ? 'text-blue-100' : 'text-blue-400'}`}>
          {deal.offer_title}
        </p>
        
        <p className={`text-sm mb-6 ${deal.featured_deal ? 'text-white/80' : 'text-gray-300'}`}>
          {deal.tool_short_desc}
        </p>

        {/* Pricing */}
        <div className="flex items-center gap-3 mb-6">
          {deal.old_price && (
            <span className={`text-lg line-through ${deal.featured_deal ? 'text-white/60' : 'text-gray-500'}`}>
              ${deal.old_price}/mo
            </span>
          )}
          {deal.new_price && (
            <span className={`text-2xl font-bold ${deal.featured_deal ? 'text-cyan-300' : 'text-cyan-400'}`}>
              ${deal.new_price}/mo
            </span>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-orange-400">⏰</span>
            <span className={`text-sm ${deal.featured_deal ? 'text-white' : 'text-gray-300'}`}>
              {isExpired ? 'Expired' : `Expires in ${daysLeft} days`}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-green-400">📈</span>
            <span className={`text-sm ${deal.featured_deal ? 'text-white' : 'text-gray-300'}`}>
              {deal.claims_count} claimed
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href={deal.deal_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-3 px-4 rounded-lg font-semibold text-center block transition-colors ${
            isExpired
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : deal.featured_deal
              ? 'bg-cyan-400 text-gray-900 hover:bg-cyan-300'
              : 'bg-cyan-500 text-white hover:bg-cyan-600'
          }`}
          onClick={isExpired ? (e) => e.preventDefault() : undefined}
        >
          {isExpired ? 'Deal Expired' : 'Claim Deal 🔗'}
        </a>
      </div>
    </div>
  );
}