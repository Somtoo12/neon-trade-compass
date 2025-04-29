
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toolsData } from '@/data/toolsData';

const ToolsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  
  // Get unique categories from tools data
  const categories = useMemo(() => {
    const cats = new Set(['All']);
    toolsData.forEach(tool => cats.add(tool.category));
    return Array.from(cats);
  }, []);

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    return toolsData.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Group tools by category for display
  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, typeof toolsData> = {};
    
    filteredTools.forEach(tool => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = [];
      }
      grouped[tool.category].push(tool);
    });
    
    return grouped;
  }, [filteredTools]);

  const handleToolClick = (path: string) => {
    navigate(path);
  };

  // Generate suggestions for search
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    
    return toolsData
      .filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5); // Limit suggestions to 5
  }, [searchQuery]);

  return (
    <AppLayout activeSection="tools" setActiveSection={() => {}}>
      <Helmet>
        <title>Trading Tools | PipCraft</title>
        <meta name="description" content="Explore our collection of trading tools designed to enhance your trading experience." />
      </Helmet>
      
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 pt-4 pb-16"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
              Trading Tools
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our comprehensive suite of tools designed to enhance your trading strategy, manage risk, and improve performance.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for tools..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-border input-glow"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
            
            {/* Search Suggestions */}
            {searchSuggestions.length > 0 && searchQuery.length >= 2 && (
              <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg">
                {searchSuggestions.map((tool) => (
                  <div
                    key={tool.id}
                    className="px-4 py-2 hover:bg-accent cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      handleToolClick(tool.path);
                      setSearchQuery('');
                    }}
                  >
                    <tool.icon className="h-4 w-4 text-accent" />
                    <div>
                      <div className="text-sm font-medium">{tool.name}</div>
                      <div className="text-xs text-muted-foreground">{tool.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="min-h-[44px]"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* No results message */}
          {Object.keys(toolsByCategory).length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tools match your search criteria.</p>
            </div>
          )}

          {/* Tools by Category */}
          {Object.entries(toolsByCategory).map(([category, tools]) => (
            <div key={category} className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 pl-1 border-l-4 border-accent pl-3">
                {category}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card 
                      className="overflow-hidden border-border/50 backdrop-blur-sm bg-card/30 hover:border-primary/30 transition-colors cursor-pointer h-full"
                      onClick={() => handleToolClick(tool.path)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="bg-secondary/50 p-3 rounded-lg">
                            <tool.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{tool.name}</h3>
                            <p className="text-sm text-muted-foreground">{tool.description}</p>
                            <div className="mt-3">
                              <Badge variant="outline" className="text-xs">
                                {tool.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ToolsPage;
