'use client';

interface PricingFilterProps {
  selectedPricing: string[];
  onPricingChange: (pricing: string[]) => void;
}

export default function PricingFilter({ selectedPricing, onPricingChange }: PricingFilterProps) {
  const pricingOptions = [
    { value: 'Free', label: 'Free', color: 'bg-green-600' },
    { value: 'Freemium', label: 'Freemium', color: 'bg-blue-600' },
    { value: 'Free Trial', label: 'Free Trial', color: 'bg-purple-600' },
    { value: 'Paid', label: 'Paid', color: 'bg-orange-600' }
  ];

  const togglePricing = (pricing: string) => {
    if (selectedPricing.includes(pricing)) {
      onPricingChange(selectedPricing.filter(p => p !== pricing));
    } else {
      onPricingChange([...selectedPricing, pricing]);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Pricing Model</h3>
      <div className="flex flex-wrap gap-2">
        {pricingOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => togglePricing(option.value)}
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              selectedPricing.includes(option.value)
                ? `${option.color} text-white`
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}