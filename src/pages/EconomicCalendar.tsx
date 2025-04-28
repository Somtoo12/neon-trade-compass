
import React, { useEffect, useRef } from 'react';
import SEO from '@/components/shared/SEO';
import { useIsMobile } from '@/hooks/use-mobile';

const EconomicCalendar = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create script for remote calendar widget
      const remoteWidgetScript = document.createElement('script');
      remoteWidgetScript.src = 'https://www.cashbackforex.com/Content/remote/remote-calendar-widget.js';
      remoteWidgetScript.async = true;
      
      // Create script for calendar configuration
      const calendarScript = document.createElement('script');
      calendarScript.textContent = `
        if (typeof RemoteCalendar === 'function') {
          RemoteCalendar({
            "DefaultTime": "today",
            "DefaultTheme": "dark",
            "Url": "https://www.cashbackforex.com",
            "SubPath": "economic-calendar",
            "IsShowEmbedButton": true,
            "ContainerId": "economic-calendar-924125"
          });
        }
      `;
      
      // Clear previous content and append scripts
      if (calendarRef.current) {
        calendarRef.current.innerHTML = '<div id="economic-calendar-924125" class="mx-auto"></div>';
        calendarRef.current.appendChild(remoteWidgetScript);
        
        // Add calendar script after remote widget script is loaded
        remoteWidgetScript.onload = () => {
          calendarRef.current?.appendChild(calendarScript);
        };
      }

      // Cleanup on unmount
      return () => {
        if (calendarRef.current) {
          calendarRef.current.innerHTML = '';
        }
      };
    }
  }, []);

  return (
    <>
      <SEO 
        title="Forex Economic Calendar – Real-Time Market Events | PipCraft"
        description="Stay ahead with PipCraft's real-time economic calendar. Filter by region, impact level, and time to plan your trades."
      />
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
          Economic Calendar
        </h1>
        <p className="text-muted-foreground mb-6">Stay ahead of market-moving events.</p>
        
        <div className="w-full rounded-lg border border-border/50 shadow-md bg-[#0f0f0f] p-2 overflow-x-auto">
          <div ref={calendarRef} className="w-full min-h-[600px] flex items-center justify-center">
            <div className="text-muted-foreground flex flex-col items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
              Loading calendar...
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-4 text-center">
          If the calendar doesn't load, {' '}
          <a 
            href="https://www.cashbackforex.com/economic-calendar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 underline"
          >
            tap here to open it on CashbackForex
          </a>
        </p>
      </div>
    </>
  );
};

export default EconomicCalendar;
