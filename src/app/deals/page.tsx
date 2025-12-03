import { getAllDeals } from '@/app/actions';
import DealCard from '@/components/DealCard';
import Link from 'next/link';

export default async function DealsPage() {
  const deals = await getAllDeals();
  const featuredDeals = deals.filter(deal => deal.featured_deal);
  const regularDeals = deals.filter(deal => !deal.featured_deal);

  return (
    <div className="min-h-screen bg-gray-black">
      <nav className="p-4 border-b border-gray-800">
        <Link href="/" className="hover:opacity-80" style={{ color: 'var(--brand-light)' }}>
          ← Back to Directory
        </Link>
      </nav>
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">AI Tool Deals & Offers</h1>
          <p className="text-xl text-gray-300">Save money on the best AI tools for your startup</p>
        </div>

        {featuredDeals.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Featured Deals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold text-white mb-8">All Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </section>

        {deals.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            <p>No deals available at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}