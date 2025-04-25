import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Calendar, AlertTriangle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SAMPLE_EVENTS = [
  {
    id: 1,
    title: 'USD Non-Farm Payrolls',
    time: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    impact: 'high',
    currency: 'USD'
  },
  {
    id: 2,
    title: 'EUR Interest Rate Decision',
    time: new Date(Date.now() + 120 * 60 * 1000), // 2 hours from now
    impact: 'high',
    currency: 'EUR'
  },
  {
    id: 3,
    title: 'GBP Manufacturing PMI',
    time: new Date(Date.now() + 180 * 60 * 1000), // 3 hours from now
    impact: 'medium',
    currency: 'GBP'
  },
  {
    id: 4,
    title: 'JPY GDP',
    time: new Date(Date.now() + 240 * 60 * 1000), // 4 hours from now
    impact: 'low',
    currency: 'JPY'
  }
];

const NextEventCountdown = ({ expanded, toggleExpanded, isMobile }: { 
  expanded: boolean; 
  toggleExpanded: () => void;
  isMobile: boolean;
}) => {
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isImminentEvent, setIsImminentEvent] = useState(false);
  const [countdownEnabled, setCountdownEnabled] = useState(() => {
    return localStorage.getItem('pipcraft_econ_countdown_enabled') === 'true';
  });
  const { toast } = useToast();
  
  useEffect(() => {
    localStorage.setItem('pipcraft_econ_countdown_enabled', String(countdownEnabled));
  }, [countdownEnabled]);
  
  useEffect(() => {
    localStorage.setItem('pipcraft_econ_display_mode', String(expanded));
  }, [expanded]);
  
  useEffect(() => {
    if (!countdownEnabled) return;
    
    const now = new Date();
    const upcomingEvents = SAMPLE_EVENTS.filter(event => event.time > now)
      .sort((a, b) => a.time.getTime() - b.time.getTime());
    
    const next = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
    setNextEvent(next);
    
    if (next) {
      localStorage.setItem('pipcraft_econ_next_news', JSON.stringify({
        title: next.title,
        time: next.time.toISOString(),
        impact: next.impact,
        currency: next.currency
      }));
    }
    
    const timer = setInterval(() => {
      if (next) {
        const diff = next.time.getTime() - Date.now();
        
        if (diff <= 0) {
          clearInterval(timer);
          setTimeRemaining('Starting now!');
          return;
        }
        
        setIsImminentEvent(diff < 5 * 60 * 1000);
        
        const minutes = Math.floor(diff / 1000 / 60);
        const seconds = Math.floor((diff / 1000) % 60);
        
        if (minutes > 60) {
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          setTimeRemaining(`Starts in ${hours}h ${mins}m`);
        } else {
          setTimeRemaining(`Starts in ${minutes}m ${seconds}s`);
        }
      } else {
        setTimeRemaining('No upcoming events');
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdownEnabled]);
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };
  
  const getImpactEmoji = (impact: string) => {
    switch (impact) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '⚪';
      default: return '⚪';
    }
  };
  
  const resetSettings = () => {
    localStorage.removeItem('pipcraft_econ_next_news');
    localStorage.removeItem('pipcraft_econ_display_mode');
    localStorage.removeItem('pipcraft_econ_countdown_enabled');
    setCountdownEnabled(false);
    toast({
      title: "Settings Reset",
      description: "Calendar preferences have been cleared",
    });
  };
  
  if (!nextEvent && !expanded) return null;
  
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 cursor-pointer",
        expanded ? "mb-4" : "mb-1",
        isImminentEvent ? "animate-pulse-glow" : "",
        "bg-[#111827] border border-neon-purple/30"
      )}
      style={{ '--glow-color': 'rgba(123, 97, 255, 0.2)' } as React.CSSProperties}
      onClick={toggleExpanded}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-neon-blue" />
            <h3 className="font-semibold text-white">
              ⚡ Next Major Event Countdown
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setCountdownEnabled(!countdownEnabled);
              }}
              className={cn(
                "p-1 h-8 w-8",
                countdownEnabled ? "text-neon-green" : "text-muted-foreground"
              )}
            >
              <Clock className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                resetSettings();
              }}
              className="p-1 h-8 w-8"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {nextEvent ? (
          <div className={cn(
            "transition-all duration-300",
            expanded ? "opacity-100 max-h-96" : (isMobile ? "opacity-0 max-h-0" : "opacity-100 max-h-8")
          )}>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  getImpactColor(nextEvent.impact)
                )} />
                <span className="font-medium text-white">
                  {nextEvent.currency} - {nextEvent.title}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Clock className="h-4 w-4 text-neon-green animate-pulse" />
                <span className="font-mono text-neon-green">
                  {timeRemaining}
                </span>
              </div>
            </div>
            
            {expanded && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={cn(
                    "h-4 w-4",
                    nextEvent.impact === 'high' ? "text-red-500" : 
                    nextEvent.impact === 'medium' ? "text-yellow-500" : "text-gray-300"
                  )} />
                  <span className="text-sm">
                    {getImpactEmoji(nextEvent.impact)} {nextEvent.impact.charAt(0).toUpperCase() + nextEvent.impact.slice(1)} Impact Event
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-2 text-center text-sm text-muted-foreground">
            No major events in the next hour. Market steady.
          </div>
        )}
      </div>
      
      {isImminentEvent && expanded && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-pulse"></div>
      )}
    </Card>
  );
};

const EconomicCalendar = () => {
  const [expanded, setExpanded] = useState(() => {
    return localStorage.getItem('pipcraft_econ_display_mode') === 'true';
  });
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
        Economic Calendar
      </h1>
      <p className="text-muted-foreground mb-6">Stay ahead of market-moving events.</p>
      
      <div className={cn(
        "sticky top-16 z-10 transition-all duration-300",
        isMobile ? "mb-4" : ""
      )}>
        <NextEventCountdown 
          expanded={expanded} 
          toggleExpanded={() => setExpanded(!expanded)} 
          isMobile={isMobile}
        />
      </div>
      
      <div className="w-full rounded-lg border border-border/50 shadow-md bg-[#0f0f0f] p-2 overflow-x-auto">
        <div className="tradingview-widget-container w-full h-[600px]">
          <iframe 
            src="https://www.tradingview.com/embed-widget/events/?locale=en#%7B%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A600%2C%22importanceFilter%22%3A%22-1%2C0%2C1%22%7D"
            className="w-full h-full"
            frameBorder="0"
            allowTransparency={true}
            scrolling="no"
          />
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mt-4 text-center">
        If the calendar doesn't load, {' '}
        <a 
          href="https://www.tradingview.com/markets/economic-calendar/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-accent hover:text-accent/80 underline"
        >
          tap here to open it on TradingView
        </a>
      </p>
    </div>
  );
};

export default EconomicCalendar;
