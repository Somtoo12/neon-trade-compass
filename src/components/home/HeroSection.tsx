
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

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

  return (
    <div 
      ref={ref}
      className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(var(--background)) 0%, hsl(var(--background)) 80%)'
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div 
            key={i} 
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            style={{
              top: `${Math.random() * 100}%`,
              left: 0,
              right: 0,
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{ 
              x: ["0%", `${(Math.random() * 40) - 20}%`],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
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
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 30px rgba(123,97,255,0.5)' }}
        >
          <span className="bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent neon-glow">
            PipCraft
          </span>
        </motion.h1>
        
        {/* Updated tagline */}
        <motion.p 
          className="relative text-lg md:text-2xl lg:text-3xl mb-6 md:mb-8 text-foreground/90 font-light z-10"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}
        >
          Your Complete Trading Command Center
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="relative z-10 flex flex-wrap sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link to="/calculators">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="group relative px-6 py-3 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-purple bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-medium text-lg transition-all duration-500 shadow-[0_0_15px_rgba(123,97,255,0.5)] hover:shadow-[0_0_25px_rgba(123,97,255,0.7)]"
                size="lg"
              >
                Explore PipCraft
                <ArrowRight className="ml-2 h-5 w-5 inline transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </Link>

          <div className="flex flex-wrap sm:flex-row gap-3">
            {isMobile ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={showAddToHomeInstructions}
                  className="relative border-accent/50 hover:border-accent bg-background/50 backdrop-blur group"
                >
                  <span className="flex items-center">
                    📲 Save to Home Screen
                  </span>
                  <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 bg-accent/10 rounded-md blur-sm"></div>
                  </div>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={showBookmarkInstructions}
                  className="relative border-accent/50 hover:border-accent bg-background/50 backdrop-blur group"
                >
                  <span className="flex items-center">
                    ⭐ Bookmark on Desktop
                  </span>
                  <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 bg-accent/10 rounded-md blur-sm"></div>
                  </div>
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
