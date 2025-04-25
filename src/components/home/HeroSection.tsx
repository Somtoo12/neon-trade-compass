
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Music, Pause, ToggleLeft, ToggleRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

// Tool icon data
const toolIcons = [
  { name: 'Pip Calculator', color: 'from-neon-green to-neon-blue' },
  { name: 'Risk Manager', color: 'from-neon-blue to-neon-purple' },
  { name: 'Max Lot Size', color: 'from-neon-purple to-neon-green' },
  { name: 'Economic Calendar', color: 'from-neon-green to-neon-blue' },
  { name: 'Challenge Blueprint', color: 'from-neon-blue to-neon-purple' },
  { name: 'Session Clock', color: 'from-neon-purple to-neon-green' },
];

const HeroSection: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [typerText, setTyperText] = useState("Loading Pip Calculator...");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (isInView) {
      // Create a typing animation sequence
      const texts = [
        "Loading Pip Calculator...",
        "Booting Risk AI...",
        "Initializing Trade Blueprint...",
        "Your Complete Trading Control Hub."
      ];
      
      let currentIndex = 0;
      const intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % texts.length;
        setTyperText(texts[currentIndex]);
        
        // Stop at the final text
        if (currentIndex === texts.length - 1) {
          clearInterval(intervalId);
        }
      }, 1500);
      
      return () => clearInterval(intervalId);
    }
  }, [isInView]);
  
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
  
  const toggleAnimations = () => {
    setAnimationsEnabled(!animationsEnabled);
    toast({
      title: animationsEnabled ? "Animations disabled" : "Animations enabled",
      duration: 2000,
    });
  };
  
  const toggleFocusMode = () => {
    if (!audioRef.current) return;
    
    if (audioPlaying) {
      audioRef.current.pause();
      toast({
        title: "Focus Mode Disabled",
        description: "Audio playback stopped",
        duration: 2000,
      });
    } else {
      audioRef.current.play().catch(err => {
        toast({
          title: "Playback Error",
          description: "Unable to play audio automatically. Please click again.",
          variant: "destructive",
        });
      });
      toast({
        title: "Focus Mode Enabled",
        description: "Playing trading focus playlist",
        duration: 2000,
      });
    }
    setAudioPlaying(!audioPlaying);
  };

  return (
    <div 
      ref={ref}
      className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden"
      style={{
        backgroundImage: animationsEnabled 
          ? 'radial-gradient(circle at 50% 50%, hsl(var(--background)) 0%, hsl(var(--background)) 80%)'
          : 'none'
      }}
    >
      {/* Animated space background */}
      {animationsEnabled && (
        <div className="absolute inset-0 overflow-hidden opacity-40">
          {/* Animated stars */}
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div 
              key={`star-${i}`} 
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
              }}
              animate={{ 
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}

          {/* Animated galaxies/orbs */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div 
              key={`orb-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-neon-purple/30 to-neon-blue/30 blur-xl"
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 20 + 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
          
          {/* Light beams */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div 
              key={`beam-${i}`} 
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
      )}
      
      {/* Floating tool icons */}
      {animationsEnabled && !isMobile && (
        <div className="absolute inset-0 overflow-hidden">
          {toolIcons.map((tool, index) => (
            <motion.div
              key={`tool-${index}`}
              className={`absolute bg-gradient-to-r ${tool.color} p-4 rounded-lg shadow-lg text-white font-medium text-sm backdrop-blur-sm`}
              style={{
                top: `${20 + (index * 10)}%`,
                left: index % 2 === 0 ? '10%' : '80%',
              }}
              animate={{
                y: [0, -10, 0],
                rotate: [-2, 2, -2],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 5 + index,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {tool.name}
            </motion.div>
          ))}
          
          {/* Bot/Assistant characters */}
          <motion.div
            className="absolute bottom-10 right-10 w-20 h-20"
            animate={{
              y: [-5, 5, -5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-neon-blue/50 to-neon-purple/50 blur-md"></div>
              <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                <div className="text-2xl">🤖</div>
              </div>
              {/* Animated eye blinks */}
              {animationsEnabled && (
                <motion.div
                  className="absolute top-6 left-6 w-2 h-2 rounded-full bg-neon-green"
                  animate={{ scale: [1, 0, 1] }}
                  transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              )}
            </div>
          </motion.div>
        </div>
      )}

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
          className="relative text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-4 font-poppins tracking-tight z-10"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 30px rgba(123,97,255,0.5)' }}
        >
          <span className="bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent neon-glow">
            PipCraft
          </span>
        </motion.h1>
        
        {/* Futuristic subtitle */}
        <motion.h2 
          className="relative text-lg md:text-2xl mb-2 text-foreground/80 font-light z-10"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}
        >
          Your Orbital Command Center for Traders
        </motion.h2>
        
        {/* Animated console typing text */}
        <motion.div 
          className="relative h-10 mb-6 md:mb-8 flex justify-center items-center overflow-hidden z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p 
            key={typerText}
            className="text-lg md:text-xl text-foreground/90 font-mono"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {typerText}
            {typerText !== "Your Complete Trading Control Hub." && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >_</motion.span>
            )}
          </motion.p>
        </motion.div>

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

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={toggleFocusMode}
              className="relative border-accent/50 hover:border-accent bg-background/50 backdrop-blur group"
            >
              <span className="flex items-center">
                <Music className="mr-2 h-5 w-5" />
                Focus Mode
              </span>
              <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-accent/10 rounded-md blur-sm"></div>
              </div>
            </Button>
          </motion.div>

          <div className="flex flex-wrap sm:flex-row gap-3 mt-3 sm:mt-0">
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
        
        {/* Toggle animations button */}
        <motion.div 
          className="absolute bottom-4 right-4 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAnimations}
            className="text-xs flex items-center gap-1 opacity-70 hover:opacity-100"
          >
            {animationsEnabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            {animationsEnabled ? "Disable" : "Enable"} Animations
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
