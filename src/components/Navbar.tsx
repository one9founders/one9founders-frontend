'use client';

import Link from 'next/link';

export default function Navbar() {
  const scrollToTools = () => {
    const toolsSection = document.querySelector('#tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitTool = () => {
    window.open('/submit', '_blank');
  };

  return (
    <nav className="px-6 py-4" style={{ backgroundColor: 'var(--gray-black)', borderBottom: '1px solid var(--gray-800)' }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-8" draggable={false} />
          <div className="flex space-x-6">
            <button onClick={scrollToTools} style={{ color: 'var(--gray-500)' }} className="hover:text-white bg-transparent border-none cursor-pointer">Explore</button>
            <a href="/admin" style={{ color: 'var(--gray-500)' }} className="hover:text-white">Admin</a>
            <Link href="/about" style={{ color: 'var(--gray-500)' }} className="hover:text-white">About</Link>
          </div>
        </div>
        <button className="btn-primary" onClick={handleSubmitTool}>
          Submit Tool
        </button>
      </div>
    </nav>
  );
}