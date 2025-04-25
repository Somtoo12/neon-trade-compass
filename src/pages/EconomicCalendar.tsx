
import React, { useState, useEffect } from 'react';
import { EventCountdown } from '@/components/calendar/EventCountdown';
import type { EconomicEvent } from '@/utils/eventUtils';

// Sample events - In production, these would come from the calendar widget
const SAMPLE_EVENTS: EconomicEvent[] = [
  {
    id: 1,
    title: 'Non-Farm Payrolls',
    time: new Date(Date.now() + 15 * 60 * 1000),
    impact: 'high',
    currency: 'USD'
  },
  {
    id: 2,
    title: 'Interest Rate Decision',
    time: new Date(Date.now() + 120 * 60 * 1000),
    impact: 'high',
    currency: 'EUR'
  },
  {
    id: 3,
    title: 'Manufacturing PMI',
    time: new Date(Date.now() + 180 * 60 * 1000),
    impact: 'medium',
    currency: 'GBP'
  }
];

const EconomicCalendar = () => {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [nextEvent, setNextEvent] = useState<EconomicEvent | null>(null);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Load stored event data
    const storedEventData = localStorage.getItem('pipcraft_next_event');
    if (storedEventData) {
      const { event } = JSON.parse(storedEventData);
      setNextEvent(event);
    }
    
    // Find next upcoming event
    const updateNextEvent = () => {
      const now = new Date();
      const upcomingEvents = SAMPLE_EVENTS.filter(event => event.time > now)
        .sort((a, b) => a.time.getTime() - b.time.getTime());
      
      const next = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
      setNextEvent(next);
    };
    
    updateNextEvent();
    const eventChecker = setInterval(updateNextEvent, 60000); // Check for new events every minute
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearInterval(eventChecker);
    };
  }, []);
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
        Economic Calendar
      </h1>
      <p className="text-muted-foreground mb-6">Stay ahead of market-moving events.</p>
      
      <div className="sticky top-16 z-10 transition-all duration-300">
        <EventCountdown 
          event={nextEvent}
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
