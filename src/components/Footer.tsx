export default function Footer() {
  return (
    <footer className="px-6 py-8" style={{ backgroundColor: 'var(--gray-900)', borderTop: '1px solid var(--gray-800)' }}>
      <div className="max-w-7xl mx-auto text-center">
        <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-6 mb-4 mx-auto" draggable={false} />
        <p className="mb-4" style={{ color: 'var(--gray-500)' }}>
          Discover, compare, and choose the right AI tools for your startup
        </p>
        <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
          © 2025 ONE9FOUNDERS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}