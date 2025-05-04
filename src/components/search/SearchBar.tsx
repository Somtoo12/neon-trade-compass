
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useClickAway } from '@/hooks/use-click-away';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toolsData } from '@/data/toolsData';
import { utilityToolsData } from '@/data/utilityToolsData';

// Combine tool data from all sources
const allTools = [...toolsData, ...utilityToolsData];

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close search results when clicking outside
  useClickAway(searchContainerRef, () => {
    setIsFocused(false);
  });

  // Search functionality
  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = allTools
        .filter(tool => 
          tool.name.toLowerCase().includes(query.toLowerCase()) ||
          tool.description?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 results
      
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  // Handle tool selection
  const handleSelectTool = (path: string) => {
    navigate(path);
    setQuery('');
    setIsFocused(false);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div ref={searchContainerRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for calculators, trading tools, and more..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pl-10 pr-10 py-6 bg-background/50 border border-accent/20 rounded-xl focus:border-accent hover:border-accent/50 backdrop-blur-sm transition-all shadow-md"
          aria-label="Search tools"
        />
        
        {query && (
          <button 
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
      
      {/* Search results dropdown */}
      {isFocused && results.length > 0 && (
        <div className="absolute w-full mt-2 bg-background/90 backdrop-blur-md border border-accent/20 rounded-xl shadow-lg overflow-hidden z-30">
          <div className="p-1">
            {results.map((tool, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors rounded-lg hover:bg-accent/10"
                onClick={() => handleSelectTool(tool.path)}
              >
                {tool.icon && <tool.icon className="h-5 w-5 text-accent" aria-label={tool.name} />}
                <div className="flex-1">
                  <p className="font-medium">{tool.name}</p>
                  {tool.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">{tool.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Show suggestions when focused but no results */}
      {isFocused && query.length < 2 && (
        <div className="absolute w-full mt-2 bg-background/90 backdrop-blur-md border border-accent/20 rounded-xl shadow-lg overflow-hidden z-30">
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {["Pip Calculator", "Password Strength", "Countdown Timer", "Word Counter", "GPA Calculator"].map((term, i) => (
                <Button 
                  key={i}
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => setQuery(term)}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
