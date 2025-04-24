
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Calculator, 
  BookOpen, 
  Clock, 
  BarChart, 
  LineChart, 
  Scale, 
  Calendar, 
  Zap, 
  TrendingUp
} from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import FeatureGrid from '@/components/home/FeatureGrid';
import LiveDataTicker from '@/components/home/LiveDataTicker';
import MetricsWall from '@/components/home/MetricsWall';
import AppHeader from '@/components/home/AppHeader';

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
        <div className="absolute inset-0 overflow-hidden opacity-20">
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

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <div className="mb-4 flex justify-center">
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
              <Badge className="text-xs md:text-sm bg-accent/20 text-accent hover:bg-accent/30">
                BUILT FOR THE TRADERS OF THE FUTURE
              </Badge>
            </motion.div>
          </div>

          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 font-poppins tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent neon-glow">
              PipCraft
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-2xl lg:text-3xl mb-6 md:mb-8 text-foreground/90 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            Smarter Trading. Every Tool You'll Ever Need — Reimagined.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={scrollToFeatures} 
              className="group relative px-6 py-3 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-purple bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-medium text-lg transition-all duration-500 shadow-[0_0_15px_rgba(123,97,255,0.5)] hover:shadow-[0_0_25px_rgba(123,97,255,0.7)]"
              size="lg"
            >
              Explore PipCraft
              <ArrowRight className="ml-2 h-5 w-5 inline transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Animated background elements */}
        <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-background to-transparent"></div>
      </div>

      {/* Feature Grid */}
      <section id="features" className="py-16 md:py-24 px-4 relative">
        <div className="container max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Trading Tools <span className="text-primary">Reimagined</span>
          </motion.h2>

          <FeatureGrid />
        </div>
      </section>

      {/* Live Data Stream */}
      <section className="py-8 overflow-hidden bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 border-y border-accent/20">
        <LiveDataTicker />
      </section>

      {/* Metrics Wall */}
      <section className="py-16 md:py-24 px-4 relative">
        <div className="container max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            PipCraft <span className="text-primary">Community</span>
          </motion.h2>
          
          <MetricsWall />
        </div>
      </section>

      {/* CTA Banner */}
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
