
import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventDetailsProps {
  title: string;
  currency: string;
  impact: string;
  timeRemaining: string;
  expanded: boolean;
  getImpactColor: (impact: string) => string;
  getImpactEmoji: (impact: string) => string;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  title,
  currency,
  impact,
  timeRemaining,
  expanded,
  getImpactColor,
  getImpactEmoji,
}) => {
  return (
    <div className={cn(
      "transition-all duration-300",
      expanded ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
    )}>
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2.5 h-2.5 rounded-full",
            getImpactColor(impact)
          )} />
          <span className="font-medium text-white">
            {currency} - {title}
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
              impact === 'high' ? "text-red-500" : 
              impact === 'medium' ? "text-yellow-500" : "text-gray-300"
            )} />
            <span className="text-sm">
              {getImpactEmoji(impact)} {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact Event
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
