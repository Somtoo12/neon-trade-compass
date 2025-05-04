
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Calculator, BellRing, Star } from 'lucide-react';
import { BarChart2, LineChart, Calendar, Clock } from 'lucide-react';
import { BrainCircuit, Smartphone, BookOpen, Gamepad, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { toolCategories } from '@/data/toolCategories';
import { SearchBar } from '../search/SearchBar';

const HeroSection: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [typerText, setTyperText] = useState("Loading Tools...");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create typing animation sequence
    const texts = [
      "Loading Tools...",
      "Exploring Calculators...",
      "Finding Productivity Tools...",
      "Smarter tools for trading, life, learning, productivity, and beyond."
    ];
    
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      setTyperText(texts[currentIndex]);
      
      if (currentIndex === texts.length - 1) {
        clearInterval(intervalId);
      }
    }, 1500);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Create audio element for focus mode
    audioRef.current = new Audio('https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS');
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const showAddToHomeInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const message = isIOS
      ? "iPhone: Tap the Share icon, then Add to Home Screen"
      : "Android: Tap the 3-dot menu, then Add to Home screen";

    toast({
      title: "Add to Home Screen",
      description: message,
      duration: 5000,
    });
  };

  const showBookmarkInstructions = () => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const key = isMac ? '⌘' : 'Ctrl';
    window.prompt(`Use ${key}+D to bookmark this site in your browser`, document.title);
  };
  
  const scrollToEmailSection = () => {
    const emailSection = document.getElementById('email-capture');
    if (emailSection) {
      emailSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 md:px-6 overflow-hidden bg-background">
      <div className="w-full max-w-7xl mx-auto relative z-10 pt-24 md:pt-36">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(to right, var(--neon-purple) 1px, transparent 1px),
            linear-gradient(to bottom, var(--neon-purple) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          transform: 'perspective(1000px) rotateX(60deg)',
          transformOrigin: 'center top'
        }} />

        <div className="relative z-20 text-center space-y-6 md:space-y-8 px-4">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-7xl font-bold font-poppins tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
              Explore Tools That Make Life Easier
            </span>
          </motion.h1>

          <motion.p 
            className="text-base md:text-lg text-foreground/80 font-mono max-w-full md:max-w-[90%] mx-auto break-words"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {typerText}
            {typerText !== "Smarter tools for trading, life, learning, productivity, and beyond." && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >_</motion.span>
            )}
          </motion.p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto w-full">
            <SearchBar />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 px-4">
            <Link to="/tools" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:opacity-90 transition-opacity min-h-[44px]"
              >
                Browse All Tools
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-accent/50 hover:border-accent bg-background/50 backdrop-blur-sm min-h-[44px]"
              onClick={scrollToEmailSection}
            >
              <BellRing className="mr-2" />
              Get Notified on New Drops
            </Button>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={showBookmarkInstructions}
                    className="hidden md:inline-flex w-full sm:w-auto border-accent/50 hover:border-accent bg-background/50 backdrop-blur-sm min-h-[44px]"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Save for Later
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add PipCraft to your desktop for quick access to free tools</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 mb-4"
            >
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={showAddToHomeInstructions}
                      className="w-full min-h-[44px] border-accent/50 hover:border-accent bg-background/50 backdrop-blur-sm animate-pulse"
                    >
                      <Smartphone className="mr-2 h-5 w-5" />
                      Save to Home Screen
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tap here to save PipCraft on your phone's home screen for easy access to all tools</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}

          {/* Tool Count Tracker */}
          <div className="w-full flex justify-center mt-8">
            <motion.div 
              className="px-4 py-2 rounded-full bg-accent/10 backdrop-blur-sm border border-accent/20 inline-flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-sm font-medium text-accent">27 Tools and Counting...</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-neon-green/20 text-neon-green">+2 New This Week</span>
            </motion.div>
          </div>

          {/* Floating tool icons animation */}
          <div className="relative h-16 md:h-24 mt-8 overflow-hidden">
            <div className="flex justify-center gap-4 md:gap-8 absolute inset-0">
              {[Calculator, BarChart2, Calendar, LineChart, Clock, BrainCircuit].map((Icon, index) => (
                <motion.div 
                  key={index}
                  className="relative"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ 
                    y: [0, -10, 0], 
                    opacity: 1 
                  }}
                  transition={{ 
                    y: { 
                      repeat: Infinity, 
                      duration: 2 + index * 0.2, 
                      ease: "easeInOut",
                      delay: index * 0.1
                    },
                    opacity: { duration: 0.5, delay: index * 0.1 }
                  }}
                >
                  <div className="p-3 md:p-4 rounded-xl bg-background/30 backdrop-blur-sm border border-accent/20 shadow-lg">
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-accent" aria-label={`Tool icon ${index + 1}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
