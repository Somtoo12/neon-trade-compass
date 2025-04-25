import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Calculator, 
  BookOpen, 
  Clock, 
  Calendar,
  Zap, 
  TrendingUp,
  ClipboardCheck,
  Scale
} from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import FeatureGrid from '@/components/home/FeatureGrid';
import LiveDataTicker from '@/components/home/LiveDataTicker';
import MetricsWall from '@/components/home/MetricsWall';
import AppHeader from '@/components/home/AppHeader';
import FeatureMarquee from '@/components/home/FeatureMarquee';
import TradingVisual from '@/components/home/TradingVisual';
import BookmarkButtons from '@/components/home/BookmarkButtons';

const HomePage: React.FC = () => {
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <AppHeader />
      
      {/* Hero Section */}
      <div 
        ref={heroRef} 
        className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(var(--background)) 0%, hsl(var(--background)) 80%)'
        }}
      >
        {/* Background effects - lower opacity */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent"></div>
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
              style={{
                top: `${Math.random() * 100}%`,
                left: 0,
                right: 0,
                transform: `translateY(${scrollY * 0.2}px)`,
                opacity: Math.random() * 0.5 + 0.2
              }}
            />
          ))}
        </div>

        <motion.div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Text protection lightbox */}
          <div className="absolute inset-0 bg-background/40 backdrop-blur-sm rounded-3xl -m-8"></div>
          
          {/* Badge with enhanced visibility */}
          <div className="relative mb-4 flex justify-center">
            <motion.div 
              animate={{ 
                boxShadow: ['0 0 0px rgba(123,97,255,0)', '0 0 20px rgba(123,97,255,0.7)', '0 0 0px rgba(123,97,255,0)'] 
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              className="inline-block"
            >
              <Badge className="text-xs md:text-sm bg-accent/20 text-accent hover:bg-accent/30 shadow-[0_2px_8px_rgba(0,0,0,0.25)] relative z-10">
                BUILT FOR THE TRADERS OF THE FUTURE
              </Badge>
            </motion.div>
          </div>

          {/* Main title with enhanced shadows */}
          <motion.h1 
            className="relative text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 font-poppins tracking-tight z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 30px rgba(123,97,255,0.5)' }}
          >
            <span className="bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent neon-glow">
              PipCraft
            </span>
          </motion.h1>
          
          {/* Updated tagline */}
          <motion.p 
            className="relative text-lg md:text-2xl lg:text-3xl mb-6 md:mb-8 text-foreground/90 font-light z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}
          >
            Advanced Trading Tools: Max Lot Calculator, Real-time Economic Calendar, and Prop Challenge Blueprint
          </motion.p>
          
          {/* Updated CTA buttons */}
          <motion.div
            className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <Link to="/max-lot-size">
              <Button 
                className="group relative px-6 py-3 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-purple bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-medium text-lg transition-all duration-500 shadow-[0_0_15px_rgba(123,97,255,0.5)] hover:shadow-[0_0_25px_rgba(123,97,255,0.7)]"
                size="lg"
              >
                Try Max Lot Calculator
                <Scale className="ml-2 h-5 w-5 inline" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Visual elements pushed down and separated from text */}
        <div className="absolute bottom-36 left-0 right-0 pt-16">
          <TradingVisual />
        </div>
        
        <div className="absolute bottom-24 left-0 right-0">
          <FeatureMarquee />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <section className="py-8 overflow-hidden bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 border-y border-accent/20">
        <LiveDataTicker />
      </section>

      <BookmarkButtons />

      {/* Featured Tools Section */}
      <section className="py-16 md:py-24 px-4 relative bg-gradient-to-b from-background to-background/95">
        <div className="container max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Professional <span className="text-primary">Trading Tools</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Max Lot Size Calculator Card */}
            <Link to="/max-lot-size">
              <motion.div 
                className="p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card"
                whileHover={{ scale: 1.02 }}
              >
                <Scale className="h-8 w-8 mb-4 text-neon-blue" />
                <h3 className="text-xl font-semibold mb-3">Max Lot Size Calculator</h3>
                <p className="text-muted-foreground">Calculate optimal position sizes based on your account equity and leverage for safer trading.</p>
              </motion.div>
            </Link>

            {/* Economic Calendar Card */}
            <Link to="/economic-calendar">
              <motion.div 
                className="p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card"
                whileHover={{ scale: 1.02 }}
              >
                <Calendar className="h-8 w-8 mb-4 text-neon-green" />
                <h3 className="text-xl font-semibold mb-3">Economic Calendar</h3>
                <p className="text-muted-foreground">Stay ahead of market-moving events with our real-time economic calendar and event tracker.</p>
              </motion.div>
            </Link>

            {/* Challenge Blueprint Card */}
            <Link to="/challenge-blueprint">
              <motion.div 
                className="p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card"
                whileHover={{ scale: 1.02 }}
              >
                <ClipboardCheck className="h-8 w-8 mb-4 text-neon-purple" />
                <h3 className="text-xl font-semibold mb-3">Challenge Blueprint</h3>
                <p className="text-muted-foreground">Master your prop firm challenge with our comprehensive planning and tracking tools.</p>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-blue/10 opacity-40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background to-background"></div>
        </div>
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="neo-card p-8 md:p-12 text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Don't just trade. <span className="text-primary">Train smarter. Play smarter. Grow faster.</span>
            </motion.h2>
            
            <motion.p 
              className="text-lg md:text-xl text-foreground/80 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join thousands of traders who are transforming their approach with PipCraft's next-generation tools.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/forex-calculator">
                <Button variant="default" size="lg" className="w-full sm:w-auto gap-2">
                  <Calculator className="h-5 w-5" />
                  Try All Tools
                </Button>
              </Link>
              
              <Link to="/trader-games">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                  <Zap className="h-5 w-5" />
                  Play Games
                </Button>
              </Link>
              
              <Link to="/risk-management">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-accent/50 hover:border-accent">
                  <TrendingUp className="h-5 w-5" />
                  Join Prop Firm Flow
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
