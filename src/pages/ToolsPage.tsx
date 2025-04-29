import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/shared/SEO';
import AppHeader from '@/components/home/AppHeader';
import Footer from '@/components/home/Footer';
import ToolCard from '@/components/tools/ToolCard';
import { toolsData } from '@/data/toolsData';
import FloatingTelegramButton from '@/components/shared/FloatingTelegramButton';

const ToolsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Define categories
  const categories = useMemo(() => {
    const allCategories = ['All', ...new Set(toolsData.map(tool => tool.category))];
    return allCategories;
  }, []);

  // Filter tools based on search query and active category
  const filteredTools = useMemo(() => {
    return toolsData.filter(tool => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Group tools by category for display
  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, typeof toolsData> = {};
    
    // If we're filtering by a specific category, only show that category
    if (activeCategory !== 'All') {
      grouped[activeCategory] = filteredTools;
      return grouped;
    }
    
    // Otherwise group all filtered tools by their categories
    filteredTools.forEach(tool => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = [];
      }
      grouped[tool.category].push(tool);
    });
    
    return grouped;
  }, [filteredTools, activeCategory]);

  // Get search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return toolsData
      .filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 suggestions
  }, [searchQuery]);

  // Scroll to tool when clicking on suggestion
  const scrollToTool = (toolId: string) => {
    const element = document.getElementById(toolId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Highlight the tool briefly
      element.classList.add('highlight-tool');
      setTimeout(() => {
        element.classList.remove('highlight-tool');
      }, 2000);
    }
    setShowSuggestions(false);
  };

  // Handle clicking outside of search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const suggestionsContainer = document.getElementById('suggestions-container');
      const searchInput = document.getElementById('tools-search-input');
      
      if (
        suggestionsContainer && 
        searchInput && 
        !suggestionsContainer.contains(event.target as Node) && 
        !searchInput.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <SEO 
        title="Trading Tools & Calculators | PipCraft"
        description="Explore PipCraft's complete toolkit for traders: risk calculators, journal tools, prop firm challenges, and more. All free, no signup required."
      />
      
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <AppHeader />
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 pt-24 pb-16">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
              Trading Tools
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to plan, execute, and analyze your trades - all in one place.
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="mb-10 relative">
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="tools-search-input"
                  className="pl-10 h-12 bg-background border-border"
                  placeholder="Search tools by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    setShowSuggestions(true);
                  }}
                  aria-label="Search tools"
                />

                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && isSearchFocused && (
                  <div 
                    id="suggestions-container"
                    className="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg py-1 animate-fade-in"
                  >
                    {searchSuggestions.map((tool) => (
                      <button
                        key={tool.id}
                        className="w-full px-4 py-2 text-left hover:bg-accent/20 flex items-center justify-between"
                        onClick={() => scrollToTool(tool.id)}
                      >
                        <div className="flex items-center">
                          <tool.icon className="h-4 w-4 mr-2 text-accent" />
                          <span>{tool.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {tool.category}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}

                {/* Empty Search Results */}
                {searchQuery && filteredTools.length === 0 && !showSuggestions && (
                  <div className="text-center mt-8">
                    <p className="text-muted-foreground">No tools found matching "{searchQuery}"</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className={`${
                    activeCategory === category 
                      ? 'bg-gradient-to-r from-neon-green to-neon-blue text-background' 
                      : 'hover:bg-accent/20'
                  } transition-all`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Tools Display */}
          <div className="space-y-12">
            {Object.keys(toolsByCategory).length > 0 ? (
              Object.entries(toolsByCategory).map(([category, tools]) => (
                <motion.section 
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    {category}
                    <Badge className="ml-3 bg-accent/20 text-accent">
                      {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
                    </Badge>
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </motion.section>
              ))
            ) : (
              <div className="py-16 text-center">
                <p className="text-muted-foreground">No tools found matching your criteria.</p>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
        <FloatingTelegramButton />
      </div>
    </>
  );
};

export default ToolsPage;
