
import React, { useState, useEffect } from 'react';
import { Search, X, Calendar } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EventRow } from './calendar/EventRow';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { formatEventTime, isUpcoming, isPast, getCountdown } from '@/lib/dateUtils';

const API_KEY = 'w9lfRZ7QZMH8BLPuDNbGdRK7';

const countryFlags: Record<string, string> = {
  'US': '🇺🇸',
  'EU': '🇪🇺',
  'GB': '🇬🇧',
  'JP': '🇯🇵',
  'AU': '🇦🇺',
  'CA': '🇨🇦',
  'CH': '🇨🇭',
  'NZ': '🇳🇿',
  'CN': '🇨🇳',
};

type BiasType = 'bullish' | 'bearish' | 'neutral';

interface EventUserData {
  bias: BiasType | null;
  notes: string;
}

interface EconomicEvent {
  id: string;
  date: string;
  country: string;
  currency: string;
  event: string;
  impact: string;
  forecast: string;
  previous: string;
  actual: string | null;
}

const EconomicCalendar: React.FC = () => {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [impactFilter, setImpactFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [userData, setUserData] = useState<Record<string, EventUserData>>(() => {
    const saved = localStorage.getItem('event_user_data');
    return saved ? JSON.parse(saved) : {};
  });
  const { toast } = useToast();
  
  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://fcsapi.com/api-v3/forex/economy?access_key=${API_KEY}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch economic events');
      }

      const data = await response.json();
      
      if (data.status && data.response) {
        const formattedEvents = data.response.map((event: any) => ({
          id: event.id,
          date: new Date(event.date).toISOString(),
          country: event.country,
          currency: event.currency,
          event: event.title,
          impact: event.impact.toLowerCase(),
          forecast: event.forecast,
          previous: event.previous,
          actual: event.actual
        }));
        setEvents(formattedEvents);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error fetching economic calendar:', error);
      toast({
        title: "Error",
        description: "Failed to fetch economic calendar data. Please try again later.",
        variant: "destructive"
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
    const interval = setInterval(fetchCalendarData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const updateEventUserData = (eventId: string, field: 'bias' | 'notes', value: string | BiasType) => {
    const updatedData = {
      ...userData,
      [eventId]: {
        ...userData[eventId] || { bias: null, notes: '' },
        [field]: value
      }
    };
    
    setUserData(updatedData);
    localStorage.setItem('event_user_data', JSON.stringify(updatedData));
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === '' || 
      event.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.currency.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesImpact = impactFilter === 'all' || event.impact === impactFilter;
    
    return matchesSearch && matchesImpact;
  });
  
  const nextHighImpactEvent = events.find(event => 
    event.impact === 'high' && new Date(event.date).getTime() > Date.now()
  );

  return (
    <div className="economic-calendar space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Economic Calendar</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchCalendarData()}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm -mx-4 px-4 py-2 border-b">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search event or currency..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-5 w-5"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={impactFilter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setImpactFilter('all')}
                  className="text-xs"
                >
                  All
                </Button>
                <Button 
                  variant={impactFilter === 'high' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setImpactFilter('high')}
                  className="text-xs"
                >
                  🔴 High
                </Button>
                <Button 
                  variant={impactFilter === 'medium' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setImpactFilter('medium')}
                  className="text-xs"
                >
                  🟠 Medium
                </Button>
                <Button 
                  variant={impactFilter === 'low' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setImpactFilter('low')}
                  className="text-xs"
                >
                  🟢 Low
                </Button>
              </div>

              {nextHighImpactEvent && (
                <div className="flex items-center gap-2 bg-accent/20 p-2 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium">Next High-Impact: </span>
                    <span>🔴 {nextHighImpactEvent.event} ({nextHighImpactEvent.currency}) in {getCountdown(nextHighImpactEvent.date)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-px -mx-4">
            {loading ? (
              <div className="space-y-px p-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div>
                {Object.entries(
                  filteredEvents.reduce((acc: Record<string, typeof filteredEvents>, event) => {
                    const date = format(new Date(event.date), 'yyyy-MM-dd');
                    acc[date] = [...(acc[date] || []), event];
                    return acc;
                  }, {})
                ).map(([date, events]) => (
                  <div key={date} className="border-b last:border-b-0">
                    <div className="sticky top-[var(--header-height)] bg-muted/50 backdrop-blur-sm px-4 py-1 text-xs font-medium text-muted-foreground">
                      📅 {format(new Date(date), 'EEEE, MMMM d')}
                    </div>
                    {events.map((event) => (
                      <EventRow
                        key={event.id}
                        event={event}
                        countryFlags={countryFlags}
                        userData={userData}
                        onUpdateUserData={updateEventUserData}
                        onViewReaction={() => {}}
                        mockReactions={{}}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No economic events found. Try adjusting your filters or refreshing.</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EconomicCalendar;
