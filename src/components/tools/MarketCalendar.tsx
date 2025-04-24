
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Folder, Calendar, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EconomicEvent {
  id: string;
  time: Date;
  country: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  forecast?: string;
  actual?: string;
}

// Mock data - normally this would come from an API
const mockEvents: EconomicEvent[] = [
  {
    id: '1',
    time: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
    country: 'USD',
    title: 'Federal Reserve Interest Rate Decision',
    impact: 'high',
    forecast: '5.50%',
  },
  {
    id: '2',
    time: new Date(Date.now() + 1000 * 60 * 120), // 2 hours from now
    country: 'EUR',
    title: 'ECB Economic Bulletin',
    impact: 'medium',
    forecast: 'N/A',
  },
  {
    id: '3',
    time: new Date(Date.now() + 1000 * 60 * 180), // 3 hours from now
    country: 'JPY',
    title: 'BOJ Monetary Policy Statement',
    impact: 'high',
    forecast: '-0.10%',
  },
  {
    id: '4',
    time: new Date(Date.now() + 1000 * 60 * 240), // 4 hours from now
    country: 'GBP',
    title: 'UK Employment Report',
    impact: 'low',
    forecast: '4.3%',
  },
];

const MarketCalendar: React.FC = () => {
  const [events, setEvents] = useState<EconomicEvent[]>(mockEvents);
  const [nextEvent, setNextEvent] = useState<EconomicEvent | null>(null);
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    // Find the next upcoming event
    const now = new Date();
    const upcoming = events
      .filter(event => event.time > now)
      .sort((a, b) => a.time.getTime() - b.time.getTime())[0];
    setNextEvent(upcoming);
  }, [events]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (nextEvent) {
        const now = new Date();
        const diff = nextEvent.time.getTime() - now.getTime();
        
        if (diff <= 0) {
          setCountdown('Released');
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEvent]);

  const getImpactColor = (impact: EconomicEvent['impact']) => {
    switch (impact) {
      case 'high':
        return 'dark:text-[#ff4444] light:text-[#dc3545]';
      case 'medium':
        return 'dark:text-[#ff9944] light:text-[#fd7e14]';
      case 'low':
        return 'dark:text-[#ffdd44] light:text-[#ffc107]';
      default:
        return 'text-gray-400';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Card className="p-6 dark:bg-[#0d0d0d] light:bg-white transition-colors duration-300">
      {nextEvent && (
        <div className="mb-8">
          <div className="text-sm text-muted-foreground mb-2">Next Event</div>
          <div className={`
            flex items-center justify-between p-4 rounded-lg border
            ${nextEvent.impact === 'high' 
              ? 'dark:border-[#ff4444]/20 dark:shadow-[0_0_20px_rgba(255,68,68,0.1)] light:border-[#dc3545]/20' 
              : nextEvent.impact === 'medium'
              ? 'dark:border-[#ff9944]/20 dark:shadow-[0_0_15px_rgba(255,153,68,0.1)] light:border-[#fd7e14]/20'
              : 'dark:border-[#ffdd44]/20 dark:shadow-[0_0_10px_rgba(255,221,68,0.1)] light:border-[#ffc107]/20'
            }
          `}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flag className="h-4 w-4" />
                <span>{nextEvent.country}</span>
                <span className="text-muted-foreground">•</span>
                <span>{nextEvent.title}</span>
              </div>
              <div className={`
                font-mono text-3xl font-bold
                ${nextEvent.impact === 'high' 
                  ? 'dark:text-[#ff4444] light:text-[#dc3545]' 
                  : nextEvent.impact === 'medium'
                  ? 'dark:text-[#ff9944] light:text-[#fd7e14]'
                  : 'dark:text-[#ffdd44] light:text-[#ffc107]'
                }
              `}>
                {countdown}
              </div>
            </div>
            <Folder className={`h-6 w-6 ${getImpactColor(nextEvent.impact)}`} />
          </div>
        </div>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead>Forecast</TableHead>
              <TableHead>Actual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{formatTime(event.time)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    {event.country}
                  </div>
                </TableCell>
                <TableCell>{event.title}</TableCell>
                <TableCell>
                  <Folder className={`h-4 w-4 ${getImpactColor(event.impact)}`} />
                </TableCell>
                <TableCell>{event.forecast || '-'}</TableCell>
                <TableCell>{event.actual || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default MarketCalendar;
