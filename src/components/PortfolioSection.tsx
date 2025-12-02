"use client";
import { useState, useEffect } from "react";
import { getAllTools, searchTools } from "@/app/actions";
import { Tool } from "@/types";
import SearchInput from "./SearchInput";
import ToolCard from "./ToolCard";
import PricingFilter from "./PricingFilter";

export default function PortfolioSection() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'newest' | 'match'>('name');

  const tags = ["All", "AI", "Productivity", "Design", "Development", "Content", "Video", "Writing", "Analytics", "Marketing"];

  useEffect(() => {
    loadTools();
  }, []);

  useEffect(() => {
    if (isSearching) {
      setFilteredTools(applyFilters(searchResults));
    } else {
      setFilteredTools(applyFilters(tools));
    }
  }, [tools, selectedTag, selectedPricing, searchResults, isSearching, sortBy]);

  const applyFilters = (toolsList: Tool[]) => {
    let filtered = toolsList;
    
    // Category filter
    if (selectedTag !== "All") {
      filtered = filtered.filter(tool => tool.category === selectedTag);
    }
    
    // Pricing filter
    if (selectedPricing.length > 0) {
      filtered = filtered.filter(tool => 
        selectedPricing.includes(tool.pricing_model || 'Paid')
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return (b.similarity || 0) - (a.similarity || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.launch_date || '').getTime() - new Date(a.launch_date || '').getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return filtered;
  };

  const loadTools = async () => {
    setLoading(true);
    const data = await getAllTools();
    setTools(data);
    setLoading(false);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    
    setIsSearching(true);
    setSearchLoading(true);
    setSortBy('match'); // Auto-set to match when searching
    const results = await searchTools(query);
    setSearchResults(results);
    setSearchLoading(false);
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
    setSortBy('name'); // Reset sort when clearing search
  };

  return (
    <section id="tools-section" className="py-16 px-6" style={{ backgroundColor: 'var(--gray-black)' }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-white">AI Tools Directory</h2>
        
        <div className="mb-12">
          <SearchInput onSearch={handleSearch} onClear={handleClearSearch} />
        </div>
        
        {/* Filters and Sort */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Category Filter */}
            {!isSearching && (
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedTag === tag 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Pricing Filter */}
            <div className="flex-1">
              <PricingFilter 
                selectedPricing={selectedPricing} 
                onPricingChange={setSelectedPricing} 
              />
            </div>
            
            {/* Sort */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Sort by</h3>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 rounded-lg bg-gray-700 text-white border border-gray-600"
              >
                {isSearching && <option value="match">Best Match</option>}
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-gray-400 text-sm">
            {filteredTools.length} tools found
            {isSearching && " for your search"}
          </div>
        )}

        {(loading || searchLoading) ? (
          <div className="text-center text-white">
            {searchLoading ? "Searching..." : "Loading tools..."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
        
        {!loading && filteredTools.length === 0 && (
          <div className="text-center text-gray-400">
            {isSearching ? "No tools found for your search." : "No tools available."}
          </div>
        )}
      </div>
    </section>
  );
}