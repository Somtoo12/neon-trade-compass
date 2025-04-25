import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Music, Calculator, BarChart2, Calendar, BrainCircuit, Clock, LineChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

// Tool grid data
const toolGrid = [
  { name: 'Pip Calculator', icon: Calculator, route: '/calculators', description: 'Fast forex calculations' },
  { name: 'Risk Manager', icon: BarChart2, route: '/risk', description: 'Smart position sizing' },
  { name: 'Max Lot Size', icon: LineChart, route: '/max-lot', description: 'Optimal trade sizing' },
  { name: 'Calendar', icon: Calendar, route: '/calendar', description: 'Economic events' },
  { name: 'Blueprint', icon: BrainCircuit, route: '/blueprint', description: 'Challenge planning' },
  { name: 'Session Clock', icon: Clock, route: '/clock', description: 'Market hours' },
];

const HeroSection: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [typerText, setTyperText] = useState("Loading Pip Calculator...");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create typing animation sequence
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
      audioRef.current.play().catch(() => {
        toast({
          title: "Playback Error",
          description: "Unable to play audio automatically",
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
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden bg-background">
      {/* Command console container */}
      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Grid background effect */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--neon-purple) 1px, transparent 1px),
              linear-gradient(to bottom, var(--neon-purple) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(1000px) rotateX(60deg)',
            transformOrigin: 'center top'
          }}
        />

        <div className="relative z-20 text-center space-y-8">
          {/* Badge and title */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <Badge className="bg-accent/20 text-accent hover:bg-accent/30">
                BUILT FOR THE TRADERS OF THE FUTURE
              </Badge>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold font-poppins tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
                PipCraft
              </span>
            </motion.h1>

            {/* Animated console text */}
            <motion.p 
              className="text-lg md:text-xl text-foreground/80 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {typerText}
              {typerText !== "Your Complete Trading Control Hub." && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >_</motion.span>
              )}
            </motion.p>
          </div>

          {/* Action buttons row */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/calculators">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-neon-purple via-neon-blue to-neon-purple bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500"
              >
                Explore PipCraft
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                if (!audioRef.current) return;
                if (audioPlaying) {
                  audioRef.current.pause();
                  toast({
                    title: "Focus Mode Disabled",
                    description: "Audio playback stopped",
                  });
                } else {
                  audioRef.current.play().catch(() => {
                    toast({
                      title: "Playback Error",
                      description: "Unable to play audio automatically",
                      variant: "destructive",
                    });
                  });
                  toast({
                    title: "Focus Mode Enabled",
                    description: "Playing trading focus playlist",
                  });
                }
                setAudioPlaying(!audioPlaying);
              }}
              className="border-accent/50 hover:border-accent"
            >
              <Music className="mr-2" />
              Focus Mode
            </Button>
            
            {isMobile ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                  toast({
                    title: "Add to Home Screen",
                    description: isIOS
                      ? "iPhone: Tap Share, then Add to Home Screen"
                      : "Android: Tap menu, then Add to Home screen",
                  });
                }}
                className="border-accent/50 hover:border-accent"
              >
                📲 Save to Home Screen
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
                  const key = isMac ? '⌘' : 'Ctrl';
                  window.prompt(`Use ${key}+D to bookmark this site`, document.title);
                }}
                className="border-accent/50 hover:border-accent"
              >
                ⭐ Bookmark on Desktop
              </Button>
            )}
          </div>

          {/* Tool grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
            {toolGrid.map((tool, index) => (
              <Link to={tool.route} key={tool.name}>
                <motion.div
                  className="group relative p-6 rounded-xl backdrop-blur-sm bg-black/20 border border-white/10 transition-all hover:bg-black/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-purple/5 to-neon-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <tool.icon className="w-8 h-8 mb-3 text-accent" />
                  <h3 className="font-medium mb-1">{tool.name}</h3>
                  <p className="text-sm text-foreground/60">{tool.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Spotify zone */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="rounded-xl p-4 backdrop-blur-sm bg-black/20 border border-white/10">
              <h3 className="text-lg font-medium mb-3">
                🚀 Trader Focus Soundtrack
              </h3>
              <iframe
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS"
                width="100%"
                height="80"
                frameBorder="0"
                allow="encrypted-media"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Settings toggle - bottom right */}
        <div className="absolute bottom-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setAnimationsEnabled(!animationsEnabled);
              toast({
                title: animationsEnabled ? "Animations disabled" : "Animations enabled",
              });
            }}
            className="text-xs opacity-60 hover:opacity-100"
          >
            {animationsEnabled ? "Disable" : "Enable"} Animations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
