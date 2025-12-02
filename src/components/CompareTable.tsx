'use client';

import { Tool } from '@/types';

interface CompareTableProps {
  tools: Tool[];
  onRemoveTool: (toolId: number) => void;
}

export default function CompareTable({ tools, onRemoveTool }: CompareTableProps) {
  const getRatingStars = (rating?: number) => {
    if (!rating) return 'N/A';
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
    ));
  };

  const getPricingDisplay = (tool: Tool) => {
    if (tool.pricing_model === 'Free') return 'Free';
    if (tool.pricing_from) {
      const frequency = tool.billing_frequency === 'Monthly' ? '/mo' : 
                       tool.billing_frequency === 'Yearly' ? '/yr' : '';
      return `$${tool.pricing_from}${frequency}`;
    }
    return tool.pricing_model || 'Contact for pricing';
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <td className="p-4 text-gray-400 font-medium">Feature</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 text-center min-w-64">
                  <div className="relative">
                    <button
                      onClick={() => onRemoveTool(tool.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                    <img
                      src={tool.image_url}
                      alt={tool.name}
                      className="w-16 h-16 object-cover rounded-lg mx-auto mb-2"
                    />
                    <h3 className="text-white font-bold text-lg">{tool.name}</h3>
                    <p className="text-gray-400 text-sm">{tool.category}</p>
                  </div>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800">
              <td className="p-4 text-gray-400 font-medium">Description</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 text-gray-300 text-sm">
                  {tool.description}
                </td>
              ))}
            </tr>
            
            <tr className="border-b border-gray-800">
              <td className="p-4 text-gray-400 font-medium">Pricing</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 text-center">
                  <span className="text-cyan-400 font-bold text-lg">
                    {getPricingDisplay(tool)}
                  </span>
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-800">
              <td className="p-4 text-gray-400 font-medium">Rating</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 text-center">
                  <div className="flex justify-center mb-1">
                    {getRatingStars(tool.rating)}
                  </div>
                  <span className="text-gray-400 text-sm">
                    {tool.rating ? `${tool.rating}/5` : 'N/A'} ({tool.review_count || 0} reviews)
                  </span>
                </td>
              ))}
            </tr>

            <tr className="border-b border-gray-800">
              <td className="p-4 text-gray-400 font-medium">Free Trial</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 text-center">
                  <span className={tool.free_trial_days ? 'text-green-400' : 'text-gray-500'}>
                    {tool.free_trial_days ? `${tool.free_trial_days} days` : 'No'}
                  </span>
                </td>
              ))}
            </tr>

            {tools.some(tool => tool.tags && tool.tags.length > 0) && (
              <tr className="border-b border-gray-800">
                <td className="p-4 text-gray-400 font-medium">Tags</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {(tool.tags || []).slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            )}

            {tools.some(tool => tool.use_cases && tool.use_cases.length > 0) && (
              <tr className="border-b border-gray-800">
                <td className="p-4 text-gray-400 font-medium">Use Cases</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-4">
                    <ul className="text-gray-300 text-sm space-y-1">
                      {(tool.use_cases || []).slice(0, 3).map((useCase, index) => (
                        <li key={index} className="text-center">• {useCase}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            )}

            <tr>
              <td className="p-4 text-gray-400 font-medium">Actions</td>
              {tools.map((tool) => (
                <td key={tool.id} className="p-4 text-center">
                  <div className="space-y-2">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Visit Tool
                    </a>
                    <a
                      href={`/tool/${tool.id}`}
                      className="block w-full py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm"
                    >
                      View Details
                    </a>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}