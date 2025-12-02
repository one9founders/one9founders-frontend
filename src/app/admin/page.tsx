'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { addTool, getAllTools, deleteTool, updateTool, bulkImportTools } from '../actions';
import { Tool } from '@/types';
import { showSuccess, showError } from '@/lib/sweetAlert';

export default function AdminPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    url: '',
    image_url: '',
    pricing_model: '',
    pricing_from: '',
    billing_frequency: '',
    free_trial_days: '',
    tags: '',
    video_demo_url: '',
    use_cases: ''
  });

  const categories = [
    'AI', 'Productivity', 'Design', 'Development', 'Content', 
    'Video', 'Writing', 'Analytics', 'Marketing', 'Sales', 
    'Customer Support', 'Finance', 'HR', 'Project Management'
  ];

  const pricingModels = ['Free', 'Freemium', 'Paid', 'Free Trial'];
  const billingFrequencies = ['Monthly', 'Yearly', 'One-time', 'Usage-based'];

  useEffect(() => {
    loadTools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const processedData = {
        ...formData,
        pricing_from: formData.pricing_from ? parseFloat(formData.pricing_from) : undefined,
        free_trial_days: formData.free_trial_days ? parseInt(formData.free_trial_days) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        use_cases: formData.use_cases ? formData.use_cases.split(',').map(uc => uc.trim()) : []
      };
      
      let result;
      if (editingTool) {
        result = await updateTool(editingTool.id, processedData);
      } else {
        result = await addTool(processedData);
      }
      
      if (result.success) {
        await showSuccess('Success!', editingTool ? 'Tool updated successfully!' : 'Tool added successfully!');
        resetForm();
        loadTools();
      } else {
        await showError('Error', 'Failed to save tool. Please try again.');
      }
    } catch (error) {
      await showError('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      url: '',
      image_url: '',
      pricing_model: '',
      pricing_from: '',
      billing_frequency: '',
      free_trial_days: '',
      tags: '',
      video_demo_url: '',
      use_cases: ''
    });
    setEditingTool(null);
  };

  const loadTools = async () => {
    const allTools = await getAllTools();
    setTools(allTools);
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description,
      category: tool.category,
      url: tool.url || '',
      image_url: tool.image_url || '',
      pricing_model: tool.pricing_model || '',
      pricing_from: tool.pricing_from?.toString() || '',
      billing_frequency: tool.billing_frequency || '',
      free_trial_days: tool.free_trial_days?.toString() || '',
      tags: tool.tags?.join(', ') || '',
      video_demo_url: tool.video_demo_url || '',
      use_cases: tool.use_cases?.join(', ') || ''
    });
    setActiveTab('single');
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this tool?')) {
      const result = await deleteTool(id);
      if (result.success) {
        await showSuccess('Success!', 'Tool deleted successfully!');
        loadTools();
      } else {
        await showError('Error', 'Failed to delete tool.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkLoading(true);
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const tools = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim());
          const tool: any = {};
          headers.forEach((header, index) => {
            tool[header] = values[index] || '';
          });
          return tool;
        });

      const result = await bulkImportTools(tools);
      if (result.success) {
        await showSuccess('Success!', `Imported ${result.added} out of ${result.total} tools successfully!`);
        loadTools();
      } else {
        await showError('Error', 'Failed to import tools. Please check the format.');
      }
    } catch (error) {
      await showError('Error', 'Failed to process file. Please check the format.');
    } finally {
      setBulkLoading(false);
      e.target.value = '';
    }
  };

  const downloadTemplate = () => {
    const headers = ['name', 'description', 'category', 'url', 'image_url', 'pricing_model', 'pricing_from', 'billing_frequency', 'tags', 'use_cases'];
    const sampleData = [
      'ChatGPT,AI-powered conversational assistant,AI,https://chat.openai.com,https://example.com/image.jpg,Freemium,20,Monthly,"conversational AI, content creation","content writing, customer support"',
      'Figma,Design collaboration platform,Design,https://figma.com,https://example.com/figma.jpg,Freemium,12,Monthly,"design, collaboration","UI/UX design, prototyping"'
    ];
    
    const csv = [headers.join(','), ...sampleData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tools_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--gray-black)' }}>
      {/* Navigation */}
      <nav className="px-6 py-4" style={{ backgroundColor: 'var(--gray-black)', borderBottom: '1px solid var(--gray-800)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-8" draggable={false} />
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        {/* Tabs */}
        <div className="flex mb-8">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-6 py-3 rounded-t-lg font-medium transition-colors ${
              activeTab === 'single' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Single Tool
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-6 py-3 rounded-t-lg font-medium transition-colors ${
              activeTab === 'bulk' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Bulk Upload
          </button>
        </div>

        {/* Single Tool Form */}
        {activeTab === 'single' && (
          <div className="rounded-lg p-8 mb-8" style={{ backgroundColor: 'var(--gray-900)', border: '1px solid var(--gray-800)' }}>
            <h2 className="text-2xl font-semibold text-white mb-6">
              {editingTool ? 'Edit Tool' : 'Add New Tool'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Tool Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Website URL</label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Pricing Model</label>
                  <select
                    name="pricing_model"
                    value={formData.pricing_model}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                  >
                    <option value="">Select pricing model</option>
                    {pricingModels.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Starting Price ($)</label>
                  <input
                    type="number"
                    name="pricing_from"
                    value={formData.pricing_from}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Billing Frequency</label>
                  <select
                    name="billing_frequency"
                    value={formData.billing_frequency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                  >
                    <option value="">Select billing frequency</option>
                    {billingFrequencies.map((freq) => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Free Trial Days</label>
                  <input
                    type="number"
                    name="free_trial_days"
                    value={formData.free_trial_days}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Video Demo URL</label>
                  <input
                    type="url"
                    name="video_demo_url"
                    value={formData.video_demo_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-vertical"
                  style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., AI, productivity, automation"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Use Cases (comma-separated)</label>
                <input
                  type="text"
                  name="use_cases"
                  value={formData.use_cases}
                  onChange={handleChange}
                  placeholder="e.g., content creation, customer support, data analysis"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium transition-colors"
                >
                  {loading ? (editingTool ? 'Updating...' : 'Adding...') : (editingTool ? 'Update Tool' : 'Add Tool')}
                </button>
                {editingTool && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Bulk Upload */}
        {activeTab === 'bulk' && (
          <div className="rounded-lg p-8 mb-8" style={{ backgroundColor: 'var(--gray-900)', border: '1px solid var(--gray-800)' }}>
            <h2 className="text-2xl font-semibold text-white mb-6">Bulk Upload Tools</h2>
            
            <div className="space-y-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--gray-800)' }}>
                <h3 className="text-lg font-medium text-white mb-3">Instructions</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Upload a CSV file with tool data</li>
                  <li>• Required columns: name, description, category</li>
                  <li>• Optional columns: url, image_url, pricing_model, pricing_from, billing_frequency, tags, use_cases</li>
                  <li>• Use comma-separated values for tags and use_cases</li>
                  <li>• Download the template below for the correct format</li>
                </ul>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={downloadTemplate}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Download Template
                </button>
                
                <label className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors cursor-pointer">
                  {bulkLoading ? 'Uploading...' : 'Upload CSV File'}
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleBulkUpload}
                    disabled={bulkLoading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tools List */}
        <div className="rounded-lg p-8" style={{ backgroundColor: 'var(--gray-900)', border: '1px solid var(--gray-800)' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">All Tools ({tools.length})</h2>
            <button
              onClick={loadTools}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              Refresh
            </button>
          </div>
          
          <div className="grid gap-4">
            {tools.map((tool) => (
              <div key={tool.id} className="p-6 rounded-lg flex justify-between items-start" style={{ backgroundColor: 'var(--gray-800)' }}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{tool.name}</h3>
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
                  <p className="text-purple-400 text-sm mb-2">{tool.category}</p>
                  <p className="text-gray-300 text-sm mb-3">{tool.description.substring(0, 150)}...</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    {tool.pricing_model && (
                      <span>Pricing: {tool.pricing_model}</span>
                    )}
                    {tool.rating && (
                      <span>Rating: {tool.rating}/5 ({tool.review_count} reviews)</span>
                    )}
                    {tool.tags && tool.tags.length > 0 && (
                      <span>Tags: {tool.tags.slice(0, 3).join(', ')}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(tool)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tool.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {tools.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No tools found. Add some tools to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}