
import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Calendar, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EconomicEvent, getImpactDetails, useEventCountdown } from '@/utils/eventUtils';

interface EventCountdownProps {
  event: EconomicEvent | null;
  expanded: boolean;
  toggleExpanded: () => void;
  isMobile: boolean;
}

export const EventCountdown: React.FC<EventCountdownProps> = ({
  event,
  expanded,
  toggleExpanded,
  isMobile,
}) => {
  const { timeRemaining, isImminentEvent } = useEventCountdown(event);
  const impactDetails = event ? getImpactDetails(event.impact) : null;
  
  if (!event && !expanded) return null;
  
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
          <div className="text-xs bg-background/30 px-2 py-1 rounded-full">
            {expanded ? "Click to collapse" : "Click for details"}
          </div>
        </div>
        
        {event ? (
          <div className={cn(
            "transition-all duration-300",
            expanded ? "opacity-100 max-h-96" : (isMobile ? "opacity-0 max-h-0" : "opacity-100 max-h-8")
          )}>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  impactDetails?.color
                )} />
                <span className="font-medium text-white">
                  {event.currency} - {event.title}
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
                    impactDetails?.textColor
                  )} />
                  <span className="text-sm">
                    {impactDetails?.emoji} {event.impact.charAt(0).toUpperCase() + event.impact.slice(1)} Impact Event
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-2 text-center text-sm text-muted-foreground">
            No major events remaining today.
          </div>
        )}
      </div>
      
      {isImminentEvent && expanded && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-pulse"></div>
      )}
    </Card>
  );
};
