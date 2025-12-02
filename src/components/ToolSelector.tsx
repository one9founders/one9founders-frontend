'use client';

import { useState } from 'react';
import { Tool } from '@/types';

interface ToolSelectorProps {
  tools: Tool[];
  selectedTools: Tool[];
  onAddTool: (tool: Tool) => void;
  loading: boolean;
}

export default function ToolSelector({ tools, selectedTools, onAddTool, loading }: ToolSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedTools.find(selected => selected.id === tool.id)
  );

  if (loading) {
    return <div className="text-center text-white mb-8">Loading tools...</div>;
  }

  return (
    <div className="mb-8">
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Select Tools to Compare ({selectedTools.length}/3)
        </h2>
        
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredTools.slice(0, 12).map((tool) => (
            <div
              key={tool.id}
              onClick={() => onAddTool(tool)}
              className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
            >
              <img
                src={tool.image_url}
                alt={tool.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <h3 className="text-white font-medium">{tool.name}</h3>
                <p className="text-gray-400 text-sm">{tool.category}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedTools.length >= 3 && (
          <p className="text-yellow-400 text-sm mt-4">
            Maximum 3 tools can be compared at once
          </p>
        )}
      </div>
    </div>
  );
}