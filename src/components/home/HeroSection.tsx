import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Music, Calculator, BarChart2, Calendar, BrainCircuit, Clock, LineChart, Star, Smartphone, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  requestNotificationPermission, 
  showNotificationPrompt, 
  checkNotificationPermission,
  getNotificationSupportMessage,
  isOneSignalReady
} from '@/utils/oneSignal';

// Tool grid data
const toolGrid = [
  { name: 'Pip Calculator', icon: Calculator, description: 'Fast forex calculations' },
  { name: 'Risk Manager', icon: BarChart2, description: 'Smart position sizing' },
  { name: 'Max Lot Size', icon: LineChart, description: 'Optimal trade sizing' },
  { name: 'Calendar', icon: Calendar, description: 'Economic events' },
  { name: 'Blueprint', icon: BrainCircuit, description: 'Challenge planning' },
  { name: 'Session Clock', icon: Clock, description: 'Market hours' },
];

const HeroSection: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [typerText, setTyperText] = useState("Loading Pip Calculator...");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<string>('loading');
  const [oneSignalLoaded, setOneSignalLoaded] = useState(false);
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
  
  // Check OneSignal availability and notification permissions
  useEffect(() => {
    // Check OneSignal initialization
    const checkOneSignal = () => {
      const isReady = isOneSignalReady();
      setOneSignalLoaded(isReady);
      return isReady;
    };
    
    // Try immediately
    if (checkOneSignal()) {
      checkNotificationPermission().then(permission => {
        setNotificationStatus(permission);
      });
    } else {
      // If not available yet, set up polling
      const intervalId = setInterval(() => {
        if (checkOneSignal()) {
          clearInterval(intervalId);
          checkNotificationPermission().then(permission => {
            setNotificationStatus(permission);
          });
        }
      }, 1000);
      
      // Stop checking after 10 seconds
      setTimeout(() => {
        clearInterval(intervalId);
        if (!oneSignalLoaded) {
          console.error("OneSignal failed to initialize within timeout period");
          setNotificationStatus('unavailable');
        }
      }, 10000);
    }
    
    return () => {
      // Cleanup any intervals on unmount
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

  const handleNotificationRequest = async () => {
    // First check if OneSignal is loaded
    if (!oneSignalLoaded) {
      toast({
        title: "Service Unavailable",
        description: "Notification service is still loading, please try again in a few moments",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // If permissions already granted, show confirmation
    const currentPermission = await checkNotificationPermission();
    if (currentPermission === 'granted') {
      setNotificationStatus('granted');
      toast({
        title: "Notifications Already Enabled",
        description: "You're already set to receive trading alerts",
        duration: 3000,
      });
      return;
    }
    
    // Show OneSignal's native prompt
    const promptResult = await showNotificationPrompt();
    
    if (promptResult.success) {
      // Check permission after prompt
      const newPermission = await checkNotificationPermission();
      setNotificationStatus(newPermission);
      
      if (newPermission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive trading alerts and market updates",
          duration: 3000,
        });
      }
    } else {
      // If OneSignal prompt fails, try browser native
      const result = await requestNotificationPermission();
      
      if (result.success) {
        setNotificationStatus('granted');
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive trading alerts and market updates",
          duration: 3000,
        });
      } else {
        const permission = await checkNotificationPermission();
        setNotificationStatus(permission);
        
        if (result.reason === 'unsupported') {
          const message = await getNotificationSupportMessage();
          toast({
            title: "Notifications Not Supported",
            description: message,
            variant: "destructive",
            duration: 5000,
          });
        } else if (permission === 'denied') {
          toast({
            title: "Notifications Blocked",
            description: "Please enable notifications in your browser settings to receive alerts",
            variant: "destructive",
            duration: 5000,
          });
        } else {
          toast({
            title: "Notification Error",
            description: result.message || "Failed to enable notifications",
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    }
  };

  const renderNotificationButton = () => {
    let buttonText = "Enable Trading Alerts";
    let buttonVariant: "outline" | "default" = "outline";
    let buttonClass = "w-full min-h-[44px] border-accent/50 hover:border-accent bg-background/50 backdrop-blur-sm";
    
    if (notificationStatus === 'loading' || !oneSignalLoaded) {
      buttonText = "Loading Notifications...";
    } else if (notificationStatus === 'granted') {
      buttonText = "Trading Alerts Enabled";
      buttonVariant = "default";
      buttonClass = "w-full min-h-[44px] bg-green-600 hover:bg-green-700";
    } else if (notificationStatus === 'denied') {
      buttonText = "Notifications Blocked";
      buttonClass = "w-full min-h-[44px] border-red-500 text-red-500 hover:bg-red-500/10";
    } else if (notificationStatus === 'unsupported') {
      buttonText = "Notifications Not Supported";
      buttonClass = "w-full min-h-[44px] border-yellow-500 text-yellow-500 hover:bg-yellow-500/10";
    } else if (notificationStatus === 'unavailable') {
      buttonText = "Notification Service Unavailable";
      buttonClass = "w-full min-h-[44px] border-yellow-500 text-yellow-500 hover:bg-yellow-500/10";
    }

    return (
      <Button
        variant={buttonVariant}
        size="lg"
        onClick={handleNotificationRequest}
        className={`${buttonClass} ${notificationStatus === 'default' ? 'animate-pulse' : ''}`}
        disabled={notificationStatus === 'loading' || notificationStatus === 'unavailable' || !oneSignalLoaded}
      >
        <Bell className="mr-2 h-5 w-5" />
        {buttonText}
      </Button>
    );
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 md:px-6 overflow-hidden bg-background">
      <div className="w-full max-w-7xl mx-auto relative z-10 pt-16 md:pt-20">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(to right, var(--neon-purple) 1px, transparent 1px),
            linear-gradient(to bottom, var(--neon-purple) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          transform: 'perspective(1000px) rotateX(60deg)',
          transformOrigin: 'center top'
        }} />

        <div className="relative z-20 text-center space-y-4 md:space-y-6 px-4">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-7xl font-bold font-poppins tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
              PipCraft
            </span>
          </motion.h1>

          <motion.p 
            className="text-base md:text-lg text-foreground/80 font-mono max-w-full md:max-w-[90%] mx-auto break-words"
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

          <div className="flex flex-col sm:flex-row justify-center gap-3 px-4">
            <Link to="/calculators" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:opacity-90 transition-opacity min-h-[44px]"
              >
                Explore PipCraft
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            
            <Link to="/focus-mode" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-accent/50 hover:border-accent bg-background/50 backdrop-blur-sm min-h-[44px]"
              >
                <Music className="mr-2" />
                Focus Mode
              </Button>
            </Link>

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
                    Bookmark on Desktop
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add PipCraft to your desktop for quick access</p>
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
              <div className="flex flex-col gap-3">
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={showAddToHomeInstructions}
                        className="w-full min-h-[44px] border-accent/50 hover:border-accent bg-background/50 backdrop-blur-sm"
                      >
                        <Smartphone className="mr-2 h-5 w-5" />
                        Save to Home Screen
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tap here to save PipCraft on your phone's home screen</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {renderNotificationButton()}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8 px-3">
            {toolGrid.map((tool, index) => (
              <motion.div
                key={tool.name}
                className="group relative p-4 md:p-6 rounded-xl backdrop-blur-sm bg-black/20 border border-white/10 transition-all hover:bg-black/30 h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-purple/5 to-neon-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <tool.icon className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3 text-accent" />
                <h3 className="text-sm md:text-base font-medium mb-1">{tool.name}</h3>
                <p className="text-xs md:text-sm text-foreground/60">{tool.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
