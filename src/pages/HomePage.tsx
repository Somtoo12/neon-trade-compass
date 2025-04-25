
import React from 'react';
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
  // Force HTTPS for consistent access
  React.useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.protocol === 'http:' &&
      !window.location.hostname.includes('localhost') &&
      !window.location.hostname.includes('127.0.0.1')
    ) {
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  }, []);

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
