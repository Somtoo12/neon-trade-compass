
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// Import home page components
import AppHeader from '@/components/home/AppHeader';
import HeroSection from '@/components/home/HeroSection';
import ToolShowcase from '@/components/home/ToolShowcase';
import ToolCategories from '@/components/home/ToolCategories';
import FeaturedTools from '@/components/home/FeaturedTools';
import GameCenter from '@/components/home/GameCenter';
import Footer from '@/components/home/Footer';
import ScrollToTop from '@/components/home/ScrollToTop';
import BookmarkButtons from '@/components/home/BookmarkButtons';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <ScrollToTop />
      <AppHeader />
      
      {/* Hero Section - Redesigned with space theme */}
      <HeroSection />

      {/* Tool Showcase - Auto-scrolling Banner */}
      <ToolShowcase />

      {/* Bookmark Functionality */}
      <BookmarkButtons />

      {/* Tool Categories */}
      <ToolCategories />

      {/* Featured Tools */}
      <FeaturedTools />

      {/* Game Center Teaser */}
      <GameCenter />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
