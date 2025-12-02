import { getToolById } from '@/app/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ToolPage({ params }: { params: { id: string } }) {
  const tool = await getToolById(parseInt(params.id));
  
  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-black">
      <nav className="p-4 border-b border-gray-800">
        <Link href="/" className="text-blue-400 hover:text-blue-300">
          ← Back to Directory
        </Link>
      </nav>
      
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gray-900 rounded-lg p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <img
              src={tool.image_url}
              alt={tool.name}
              className="w-full md:w-64 h-48 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold text-white">{tool.name}</h1>
                {tool.verified && (
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                    Verified
                  </span>
                )}
                {tool.featured && (
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm">
                    Featured
                  </span>
                )}
              </div>
              
              <p className="text-gray-300 text-lg mb-6">{tool.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white ml-2">{tool.category}</span>
                </div>
                <div>
                  <span className="text-gray-400">Rating:</span>
                  <span className="text-yellow-400 ml-2">
                    ★ {tool.rating} ({tool.review_count} reviews)
                  </span>
                </div>
                {tool.pricing_model && (
                  <div>
                    <span className="text-gray-400">Pricing:</span>
                    <span className="text-white ml-2">
                      {tool.pricing_model}
                      {tool.pricing_from && ` from $${tool.pricing_from}/${tool.billing_frequency?.toLowerCase()}`}
                    </span>
                  </div>
                )}
                {tool.free_trial_days && (
                  <div>
                    <span className="text-gray-400">Free Trial:</span>
                    <span className="text-green-400 ml-2">{tool.free_trial_days} days</span>
                  </div>
                )}
              </div>
              
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Visit {tool.name}
              </a>
            </div>
          </div>
          
          {tool.tags && tool.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {tool.use_cases && tool.use_cases.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Use Cases</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {tool.use_cases.map((useCase: string, index: number) => (
                  <li key={index}>{useCase}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}