'use client';

import { useState, useEffect } from 'react';
import { getAllTools } from '@/app/actions';
import { Tool } from '@/types';
import CompareTable from '@/components/CompareTable';
import ToolSelector from '@/components/ToolSelector';
import Link from 'next/link';

export default function ComparePage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    const data = await getAllTools();
    setTools(data);
    setLoading(false);
  };

  const addTool = (tool: Tool) => {
    if (selectedTools.length < 3 && !selectedTools.find(t => t.id === tool.id)) {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const removeTool = (toolId: number) => {
    setSelectedTools(selectedTools.filter(t => t.id !== toolId));
  };

  return (
    <div className="min-h-screen bg-gray-black">
      <nav className="p-4 border-b border-gray-800">
        <Link href="/" className="hover:opacity-80" style={{ color: 'var(--brand-light)' }}>
          ← Back to Directory
        </Link>
      </nav>
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Compare AI Tools</h1>
          <p className="text-xl text-gray-300">Compare features, pricing, and ratings side by side</p>
        </div>

        <ToolSelector 
          tools={tools}
          selectedTools={selectedTools}
          onAddTool={addTool}
          loading={loading}
        />

        {selectedTools.length > 0 && (
          <CompareTable 
            tools={selectedTools}
            onRemoveTool={removeTool}
          />
        )}
      </div>
    </div>
  );
}