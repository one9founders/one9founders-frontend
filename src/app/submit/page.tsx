'use client';

import { useState } from 'react';
import Link from 'next/link';
import { addTool } from '@/app/actions';
import { showSuccess, showError } from '@/lib/sweetAlert';

export default function SubmitToolPage() {
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const categories = [
    'AI', 'Productivity', 'Design', 'Development', 'Content', 
    'Video', 'Writing', 'Analytics', 'Marketing', 'Sales', 
    'Customer Support', 'Finance', 'HR', 'Project Management'
  ];

  const pricingModels = ['Free', 'Freemium', 'Paid', 'Free Trial'];
  const billingFrequencies = ['Monthly', 'Yearly', 'One-time', 'Usage-based'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category) {
      setMessage('Please fill in all required fields.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const processedData = {
        ...formData,
        pricing_from: formData.pricing_from ? parseFloat(formData.pricing_from) : undefined,
        free_trial_days: formData.free_trial_days ? parseInt(formData.free_trial_days) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        use_cases: formData.use_cases ? formData.use_cases.split(',').map(uc => uc.trim()) : []
      };
      
      const result = await addTool(processedData);
      
      if (result.success) {
        await showSuccess('Success!', 'Tool submitted successfully! It will be reviewed and added to the directory.');
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
      } else {
        await showError('Error', 'Failed to submit tool. Please try again.');
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

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Submit an AI Tool
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Help fellow founders discover amazing AI tools by submitting your recommendations
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-lg p-8" style={{ backgroundColor: 'var(--gray-900)', border: '1px solid var(--gray-800)' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tool Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Tool Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., ChatGPT, Midjourney, Notion AI"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what this tool does and how it helps founders/startups..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-vertical"
                  style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                  required
                />
                <p className="text-sm text-gray-400 mt-1">
                  Be specific about the tool's features and benefits for startups
                </p>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Website URL */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-white mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                />
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-white mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                />
              </div>

              {/* Pricing Model */}
              <div>
                <label htmlFor="pricing_model" className="block text-sm font-medium text-white mb-2">
                  Pricing Model
                </label>
                <select
                  id="pricing_model"
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

              {/* Pricing From */}
              {formData.pricing_model === 'Paid' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pricing_from" className="block text-sm font-medium text-white mb-2">
                      Starting Price ($)
                    </label>
                    <input
                      type="number"
                      id="pricing_from"
                      name="pricing_from"
                      value={formData.pricing_from}
                      onChange={handleChange}
                      placeholder="19"
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                      style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="billing_frequency" className="block text-sm font-medium text-white mb-2">
                      Billing Frequency
                    </label>
                    <select
                      id="billing_frequency"
                      name="billing_frequency"
                      value={formData.billing_frequency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                      style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                    >
                      <option value="">Select frequency</option>
                      {billingFrequencies.map((freq) => (
                        <option key={freq} value={freq}>{freq}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Free Trial Days */}
              {formData.pricing_model === 'Free Trial' && (
                <div>
                  <label htmlFor="free_trial_days" className="block text-sm font-medium text-white mb-2">
                    Free Trial Duration (days)
                  </label>
                  <input
                    type="number"
                    id="free_trial_days"
                    name="free_trial_days"
                    value={formData.free_trial_days}
                    onChange={handleChange}
                    placeholder="7"
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                  />
                </div>
              )}

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-white mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="automation, chatbot, customer service"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                />
                <p className="text-sm text-gray-400 mt-1">
                  Comma-separated tags that describe the tool
                </p>
              </div>

              {/* Video Demo URL */}
              <div>
                <label htmlFor="video_demo_url" className="block text-sm font-medium text-white mb-2">
                  Video Demo URL
                </label>
                <input
                  type="url"
                  id="video_demo_url"
                  name="video_demo_url"
                  value={formData.video_demo_url}
                  onChange={handleChange}
                  placeholder="https://youtube.com/embed/..."
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                />
              </div>

              {/* Use Cases */}
              <div>
                <label htmlFor="use_cases" className="block text-sm font-medium text-white mb-2">
                  Use Cases
                </label>
                <input
                  type="text"
                  id="use_cases"
                  name="use_cases"
                  value={formData.use_cases}
                  onChange={handleChange}
                  placeholder="content creation, social media, email marketing"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  style={{ backgroundColor: 'var(--gray-800)', border: '1px solid var(--gray-700)', color: 'white' }}
                />
                <p className="text-sm text-gray-400 mt-1">
                  Comma-separated use cases for this tool
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: loading ? 'var(--gray-700)' : 'var(--brand-primary)',
                    color: 'white'
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit Tool'}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-lg ${messageType === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="py-16 px-6" style={{ backgroundColor: 'var(--gray-900)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Submission Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">What We're Looking For</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  AI-powered tools that solve real business problems
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Tools specifically useful for startups and founders
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Clear, detailed descriptions of functionality
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Active, maintained tools with good reputation
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Please Avoid</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Duplicate submissions of existing tools
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Tools that are no longer active or maintained
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Vague or marketing-heavy descriptions
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Tools without clear AI/automation features
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Help Build the Directory</h2>
          <p className="text-xl text-gray-300 mb-8">
            Every submission helps fellow founders discover tools that can accelerate their growth. 
            Your contribution makes a difference in the startup community.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/admin" className="btn-secondary">
              View Admin Panel
            </Link>
            <Link href="/" className="btn-primary">
              Explore Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6" style={{ backgroundColor: 'var(--gray-black)', borderTop: '1px solid var(--gray-800)' }}>
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 One9Founders. Built for founders, by founders.</p>
        </div>
      </footer>
    </div>
  );
}