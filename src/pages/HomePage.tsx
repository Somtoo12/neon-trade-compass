
import React from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/shared/SEO';
import FloatingTelegramButton from '@/components/shared/FloatingTelegramButton';
import { Link } from 'react-router-dom';

// Import home page components
import AppHeader from '@/components/home/AppHeader';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import PopularTools from '@/components/home/PopularTools';
import UserTestimonials from '@/components/home/UserTestimonials';
import TrustSection from '@/components/home/TrustSection';
import EmailCapture from '@/components/home/EmailCapture';
import Footer from '@/components/home/Footer';
import ScrollToTop from '@/components/home/ScrollToTop';

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
    <>
      <SEO 
        title="PipCraft – Free Tools for Trading, Productivity, and Beyond"
        description="Discover smarter tools for trading, life, learning, productivity, and beyond. Pip calculators, password strength checkers, countdown timers, word counters, and more - all free without signup."
        keywords="forex pip calculator for beginners, password strength checker online free, online countdown timer with alarm, online word counter free tool"
        canonical="https://pipcrafts.com/"
      />
      <div className="min-h-screen bg-background text-foreground overflow-hidden">
        <ScrollToTop />
        <AppHeader />
        
        {/* Hero Section - Modern design with search functionality */}
        <HeroSection />

        {/* Featured Categories Grid */}
        <FeaturedCategories />

        {/* Popular Tools Carousel / Grid */}
        <PopularTools />

        {/* User Testimonials */}
        <UserTestimonials />

        {/* Trust Section */}
        <TrustSection />

        {/* Email Capture / Newsletter */}
        <EmailCapture />

        {/* Footer */}
        <Footer />
        <FloatingTelegramButton />
      </div>
    </>
  );
};

export default HomePage;
