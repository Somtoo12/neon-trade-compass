
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { formatEventTime, isUpcoming, isPast } from '@/lib/dateUtils';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EventRowProps {
  event: {
    id: string;
    date: string;
    country: string;
    currency: string;
    event: string;
    impact: string;
    forecast: string;
    previous: string;
    actual: string | null;
  };
  countryFlags: Record<string, string>;
  userData: any;
  onUpdateUserData: (eventId: string, field: 'bias' | 'notes', value: any) => void;
  onViewReaction: (eventId: string) => void;
  mockReactions: Record<string, any>;
}

export const EventRow: React.FC<EventRowProps> = ({
  event,
  countryFlags,
  userData,
  onUpdateUserData,
  onViewReaction,
  mockReactions
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPastEvent = isPast(event.date);
  const isUpcomingEvent = isUpcoming(event.date);
  
  const impactColor = {
    high: 'text-red-500',
    medium: 'text-orange-500',
    low: 'text-green-500'
  }[event.impact] || 'text-gray-500';

  return (
    <Card className={cn(
      "border-l-0 border-r-0 rounded-none transition-all hover:bg-accent/5",
      isPastEvent && "opacity-60",
      isExpanded && "bg-accent/5"
    )}>
      <div className="grid grid-cols-[auto_auto_auto_1fr_auto] gap-4 p-2 items-center text-sm font-mono">
        <Tooltip>
          <TooltipTrigger className="text-left min-w-[120px]">
            <span className={cn(
              isUpcomingEvent && "text-yellow-500 font-medium",
              isPastEvent && "text-muted-foreground"
            )}>
              {isUpcomingEvent && "⏳ "}{formatEventTime(event.date)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            Time shown in your local timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </TooltipContent>
        </Tooltip>

        <span className={impactColor}>
          {event.impact === 'high' ? '🔴' : event.impact === 'medium' ? '🟠' : '🟢'}
        </span>

        <span className="whitespace-nowrap">
          {countryFlags[event.country]} {event.currency}
        </span>

        <span className="truncate">{event.event}</span>

        <div className="flex items-center gap-2">
          {mockReactions[event.id] && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewReaction(event.id)}
              className="h-7 px-2"
            >
              📊
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn("h-7 px-2", isExpanded && "bg-accent/10")}
          >
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-180"
            )} />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-2 pb-2 grid grid-cols-[1fr_1fr] gap-4 text-sm border-t mt-2 pt-2 bg-accent/5">
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">Actual</div>
                <div className="font-medium">{event.actual || 'Pending'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Forecast</div>
                <div className="font-medium">{event.forecast}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Previous</div>
                <div className="font-medium">{event.previous}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex gap-1">
              <Button 
                variant={userData[event.id]?.bias === 'bullish' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => onUpdateUserData(event.id, 'bias', 'bullish')}
                className="h-7 text-xs"
              >
                🔼 Bullish
              </Button>
              <Button 
                variant={userData[event.id]?.bias === 'bearish' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => onUpdateUserData(event.id, 'bias', 'bearish')}
                className="h-7 text-xs"
              >
                🔽 Bearish
              </Button>
              <Button 
                variant={userData[event.id]?.bias === 'neutral' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => onUpdateUserData(event.id, 'bias', 'neutral')}
                className="h-7 text-xs"
              >
                😐 Neutral
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
