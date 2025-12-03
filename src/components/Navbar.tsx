'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';
import AuthModal from './AuthModal';
import Swal from 'sweetalert2';

export default function Navbar() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const scrollToTools = () => {
    const toolsSection = document.querySelector('#tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitTool = () => {
    window.open('/submit', '_blank');
  };

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, sign out',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      localStorage.clear();
      sessionStorage.clear();
      try {
        await signOut();
      } catch (error) {
        console.error('Sign out error:', error);
      }
      window.location.href = '/';
    }
  };

  return (
    <>
      <nav className="px-6 py-4" style={{ backgroundColor: 'var(--gray-black)', borderBottom: '1px solid var(--gray-800)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-8" draggable={false} />
            <div className="flex space-x-6">
              <button onClick={scrollToTools} style={{ color: 'var(--gray-500)' }} className="hover:text-white bg-transparent border-none cursor-pointer">Explore</button>
              <Link href="/deals" style={{ color: 'var(--gray-500)' }} className="hover:text-white">Deals</Link>
              <Link href="/compare" style={{ color: 'var(--gray-500)' }} className="hover:text-white">Compare</Link>
              <Link href="/news" style={{ color: 'var(--gray-500)' }} className="hover:text-white">News</Link>
              <a href="/admin" style={{ color: 'var(--gray-500)' }} className="hover:text-white">Admin</a>
              <Link href="/about" style={{ color: 'var(--gray-500)' }} className="hover:text-white">About</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!loading && (
              user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white text-sm">{user.user_metadata?.full_name || user.email}</span>
                  <button onClick={handleSignOut} className="text-gray-400 hover:text-white">
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="btn-primary px-4 py-2"
                >
                  Sign In
                </button>
              )
            )}
            <button className="btn-primary" onClick={handleSubmitTool}>
              Submit Tool
            </button>
          </div>
        </div>
      </nav>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}