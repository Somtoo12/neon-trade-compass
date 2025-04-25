
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Calendar, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { EventDetails } from './EventDetails';
import { CalendarEvent, findNextEvent, formatTimeRemaining, getImpactColor, getImpactEmoji } from '@/utils/eventUtils';

interface NextEventCountdownProps {
  expanded: boolean;
  toggleExpanded: () => void;
  isMobile: boolean;
  events: CalendarEvent[];
}

export const NextEventCountdown: React.FC<NextEventCountdownProps> = ({ 
  expanded, 
  toggleExpanded,
  isMobile,
  events
}) => {
  const [nextEvent, setNextEvent] = useState<CalendarEvent | null>(null);
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
    
    const next = findNextEvent(events);
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
        setIsImminentEvent(diff < 5 * 60 * 1000);
        setTimeRemaining(formatTimeRemaining(next.time));
      } else {
        setTimeRemaining('No upcoming events');
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdownEnabled, events]);
  
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
          <EventDetails
            title={nextEvent.title}
            currency={nextEvent.currency}
            impact={nextEvent.impact}
            timeRemaining={timeRemaining}
            expanded={expanded}
            getImpactColor={getImpactColor}
            getImpactEmoji={getImpactEmoji}
          />
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
