
import React, { useState, useEffect } from 'react';
import { Search, X, ChevronDown, ExternalLink, Clock, Calendar } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for initial rendering before API fetch
const mockEvents = [
  {
    id: 'event1',
    date: new Date().toISOString(),
    country: 'US',
    currency: 'USD',
    event: 'CPI (YoY)',
    impact: 'high',
    forecast: '2.9%',
    previous: '3.1%',
    actual: '3.0%',
  },
  {
    id: 'event2',
    date: new Date(Date.now() + 3600000).toISOString(),
    country: 'EU',
    currency: 'EUR',
    event: 'ECB Interest Rate Decision',
    impact: 'high',
    forecast: '3.75%',
    previous: '3.75%',
    actual: null,
  },
  {
    id: 'event3',
    date: new Date(Date.now() + 7200000).toISOString(),
    country: 'GB',
    currency: 'GBP',
    event: 'Manufacturing PMI',
    impact: 'medium',
    forecast: '51.2',
    previous: '50.7',
    actual: null,
  },
  {
    id: 'event4',
    date: new Date(Date.now() + 10800000).toISOString(),
    country: 'JP',
    currency: 'JPY',
    event: 'GDP Growth Rate QoQ',
    impact: 'low',
    forecast: '0.3%',
    previous: '0.1%',
    actual: null,
  }
];

// Country flags mapping
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

// User biases types
type BiasType = 'bullish' | 'bearish' | 'neutral';

// Event user data type
interface EventUserData {
  bias: BiasType | null;
  notes: string;
}

// Reaction data type
interface ReactionData {
  previousActual: string;
  previousForecast: string;
  date: string;
  notes: string;
  imageUrl: string;
}

const mockReactions: Record<string, ReactionData> = {
  'event1': {
    previousActual: '3.1%',
    previousForecast: '3.0%',
    date: '2023-03-15',
    notes: 'EURUSD spiked 60 pips then reversed in 15 mins. Initial reaction was bullish due to lower than expected inflation.',
    imageUrl: 'https://i.imgur.com/mGfQJEF.png'
  },
  'event2': {
    previousActual: '3.75%',
    previousForecast: '3.75%',
    date: '2023-04-12',
    notes: 'No change as expected, but hawkish commentary led to 45 pip rally in EURUSD over next hour.',
    imageUrl: 'https://i.imgur.com/NsSH0KM.png'
  }
};

// Helper function to format time from ISO string
const formatLocalTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper function to generate countdown string
const getCountdown = (futureTime: string) => {
  const future = new Date(futureTime).getTime();
  const now = Date.now();
  const diff = future - now;
  
  if (diff <= 0) return 'Now';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
};

const EconomicCalendar: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('fcs_api_key'));
  const [showApiKeyModal, setShowApiKeyModal] = useState(!apiKey);
  const [events, setEvents] = useState(mockEvents);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [impactFilter, setImpactFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [userData, setUserData] = useState<Record<string, EventUserData>>(() => {
    const saved = localStorage.getItem('event_user_data');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  
  // Function to fetch economic calendar data
  const fetchCalendarData = async () => {
    if (!apiKey) return;
    
    setLoading(true);
    try {
      // In a real implementation, we would fetch from the actual API endpoint
      // const response = await fetch(`https://fcsapi.com/api-v3/forex/economy_cal?access_key=${apiKey}`);
      // const data = await response.json();
      
      // For now, we'll simulate an API response with our mock data
      setTimeout(() => {
        setEvents(mockEvents);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching economic calendar:', error);
      setLoading(false);
    }
  };
  
  // Save API key and initiate first fetch
  const saveApiKey = (key: string) => {
    localStorage.setItem('fcs_api_key', key);
    setApiKey(key);
    setShowApiKeyModal(false);
    fetchCalendarData();
  };
  
  // Update user data for an event
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
  
  // Filter events based on search and impact
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === '' || 
      event.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.currency.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesImpact = impactFilter === 'all' || event.impact === impactFilter;
    
    return matchesSearch && matchesImpact;
  });
  
  // Find next high impact event
  const nextHighImpactEvent = events.find(event => 
    event.impact === 'high' && new Date(event.date).getTime() > Date.now()
  );

  // Initial fetch when component mounts and apiKey exists
  useEffect(() => {
    if (apiKey) {
      fetchCalendarData();
    }
  }, [apiKey]);
  
  // Render impact badge with appropriate color
  const renderImpactBadge = (impact: string) => {
    switch(impact) {
      case 'high':
        return <Badge className="bg-red-500 hover:bg-red-600">🔴 High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500 hover:bg-orange-600">🟠 Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500 hover:bg-green-600">🟢 Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="economic-calendar">
      {/* API Key Modal */}
      <Dialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>FCSAPI Access Key Required</DialogTitle>
            <DialogDescription>
              Enter your FCSAPI Access Key to enable the economic calendar.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <div className="grid flex-1 gap-2">
              <Input
                id="apikey"
                type="text" 
                placeholder="Your FCSAPI Access Key"
                onChange={(e) => setApiKey(e.target.value)}
                className="input-glow"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="border border-neon-purple shadow-[0_0_10px_rgba(123,97,255,0.4)]"
              onClick={() => apiKey && saveApiKey(apiKey)}
              disabled={!apiKey}
            >
              Save & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reaction Modal */}
      <AlertDialog open={!!selectedReaction} onOpenChange={() => setSelectedReaction(null)}>
        {selectedReaction && mockReactions[selectedReaction] && (
          <AlertDialogContent className="max-w-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Previous Market Reaction</AlertDialogTitle>
              <AlertDialogDescription>
                {events.find(e => e.id === selectedReaction)?.event} - {mockReactions[selectedReaction].date}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-4 border-r pr-4">
                <h4 className="font-medium">Previous Release</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Forecast</p>
                    <p className="font-medium">{mockReactions[selectedReaction].previousForecast}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Actual</p>
                    <p className="font-medium">{mockReactions[selectedReaction].previousActual}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Market Reaction</h4>
                <p className="text-sm">{mockReactions[selectedReaction].notes}</p>
                <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                  <img 
                    src={mockReactions[selectedReaction].imageUrl} 
                    alt="Price reaction chart" 
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>

      <Card className="p-6 neo-card">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-2xl font-semibold">Economic Calendar</h3>
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

          {/* Sticky Controls */}
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 -m-4 mb-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search event or currency..." 
                className="pl-10 input-glow" 
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
            
            {/* Impact Filters */}
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
            
            {/* Next High Impact Countdown */}
            {nextHighImpactEvent && (
              <div className="flex items-center gap-2 bg-accent/20 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-accent" />
                <div className="text-sm">
                  <span className="font-semibold">Next High-Impact Event: </span>
                  <span>🔴 {nextHighImpactEvent.event} ({nextHighImpactEvent.currency}) in {getCountdown(nextHighImpactEvent.date)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Timeline Heatmap */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4 min-w-max">
              {events.map(event => (
                <div 
                  key={`timeline-${event.id}`} 
                  className="flex items-center gap-2 px-3 py-1.5 border rounded-full whitespace-nowrap text-sm"
                >
                  {formatLocalTime(event.date)} {event.impact === 'high' ? '🔴' : event.impact === 'medium' ? '🟠' : '🟢'} {countryFlags[event.country] || ''} {event.event}
                </div>
              ))}
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-6">
            {loading ? (
              // Loading skeleton
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-5 w-40" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <Skeleton className="h-16" />
                      <Skeleton className="h-16" />
                      <Skeleton className="h-16" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <Card key={event.id} className="p-4 overflow-hidden glassmorphism">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-medium">{formatLocalTime(event.date)}</span>
                          <span className="text-lg">{countryFlags[event.country] || ''} {event.currency}</span>
                        </div>
                        <h4 className="text-lg font-medium">{event.event}</h4>
                      </div>
                      <div>
                        {renderImpactBadge(event.impact)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div className="p-3 rounded-md bg-secondary/50">
                        <div className="text-xs text-muted-foreground mb-1">Forecast</div>
                        <div className="font-semibold">{event.forecast || 'N/A'}</div>
                      </div>
                      <div className="p-3 rounded-md bg-secondary/50">
                        <div className="text-xs text-muted-foreground mb-1">Previous</div>
                        <div className="font-semibold">{event.previous || 'N/A'}</div>
                      </div>
                      <div className="p-3 rounded-md bg-secondary/50">
                        <div className="text-xs text-muted-foreground mb-1">Actual</div>
                        <div className="font-semibold">{event.actual || 'Pending'}</div>
                      </div>
                    </div>
                    
                    {/* User Bias and Notes Section */}
                    <div className="mt-4 border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Bias:</label>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant={userData[event.id]?.bias === 'bullish' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => updateEventUserData(event.id, 'bias', 'bullish')}
                          >
                            🔼 Bullish
                          </Button>
                          <Button 
                            variant={userData[event.id]?.bias === 'bearish' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => updateEventUserData(event.id, 'bias', 'bearish')}
                          >
                            🔽 Bearish
                          </Button>
                          <Button 
                            variant={userData[event.id]?.bias === 'neutral' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => updateEventUserData(event.id, 'bias', 'neutral')}
                          >
                            😐 Neutral
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor={`notes-${event.id}`} className="text-sm font-medium">Notes:</label>
                        <Textarea 
                          id={`notes-${event.id}`}
                          placeholder="E.g., Expect spike if actual > forecast"
                          value={userData[event.id]?.notes || ''}
                          onChange={(e) => updateEventUserData(event.id, 'notes', e.target.value)}
                          className="resize-none"
                          rows={2}
                        />
                      </div>
                    </div>
                    
                    {/* Previous Market Reaction */}
                    {mockReactions[event.id] && (
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedReaction(event.id)}
                          className="w-full flex items-center justify-center gap-2 border-dashed"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Last Reaction
                        </Button>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No economic events match your search criteria.</p>
                </div>
              )
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EconomicCalendar;
