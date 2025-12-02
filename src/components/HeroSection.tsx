'use client';

export default function HeroSection() {
  const scrollToTools = () => {
    const toolsSection = document.querySelector('#tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="text-white py-20 px-6" style={{ backgroundColor: 'var(--gray-black)' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-6">
            Find, Compare and Choose the Right AI Tools Superfast
          </h1>
          <p className="text-xl mb-8">
            Discover the right AI tools crafted to boost your startup's productivity. Explore curated solutions designed to streamline workflows and accelerate growth. Make smarter decisions faster with clarity, not clutter.
          </p>
          <button className="btn-primary" onClick={scrollToTools}>
            Explore Tools
          </button>
        </div>
        <div className="flex justify-center">
          <video 
            className="w-full max-w-lg rounded-lg shadow-lg" 
            autoPlay 
            muted 
            loop
            poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
          >
            <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}