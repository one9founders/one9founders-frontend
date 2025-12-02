import Link from 'next/link';

export default function AboutPage() {
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
            About One9Founders
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Empowering founders with intelligent AI tool discovery
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 mb-6">
                In today's rapidly evolving AI landscape, founders and entrepreneurs face an overwhelming number of tools and platforms. 
                One9Founders was created to solve this challenge by providing intelligent, semantic search capabilities that help you 
                discover the right AI tools for your specific needs.
              </p>
              <p className="text-gray-300">
                We believe that the right tools can accelerate your startup's growth, streamline workflows, and unlock new possibilities. 
                Our platform cuts through the noise to deliver curated, relevant recommendations tailored to your business requirements.
              </p>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=400&fit=crop" 
                alt="AI Technology" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6" style={{ backgroundColor: 'var(--gray-900)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose One9Founders?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Intelligent Search</h3>
              <p className="text-gray-400">
                Natural language search powered by advanced AI embeddings. Find tools by describing what you need, not just keywords.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Curated Quality</h3>
              <p className="text-gray-400">
                Hand-selected AI tools with verified information. Every tool in our directory is evaluated for quality and relevance.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Founder-Focused</h3>
              <p className="text-gray-400">
                Built specifically for startup founders and entrepreneurs. Tools are categorized and described with business impact in mind.
              </p>
            </div>
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