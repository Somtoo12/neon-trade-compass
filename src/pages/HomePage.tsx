
import React from 'react';
import { motion } from 'framer-motion';

// Import home page components
import AppHeader from '@/components/home/AppHeader';
import HeroSection from '@/components/home/HeroSection';
import ToolShowcase from '@/components/home/ToolShowcase';
import ToolCategories from '@/components/home/ToolCategories';
import FeaturedTools from '@/components/home/FeaturedTools';
import GameCenter from '@/components/home/GameCenter';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/home/ScrollToTop';
import BookmarkButtons from '@/components/home/BookmarkButtons';
import TradingArticle from '@/components/home/TradingArticle';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <ScrollToTop />
      <AppHeader />
      
      <HeroSection />
      <ToolShowcase />
      <BookmarkButtons />
      <ToolCategories />
      <FeaturedTools />
      <GameCenter />
      <TradingArticle />
      <Footer />
    </div>
  );
};

export default HomePage;
