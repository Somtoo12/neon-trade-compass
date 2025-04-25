
import React from 'react';

const EconomicCalendar = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
        Economic Calendar
      </h1>
      
      <div className="w-full rounded-lg border border-border/50 shadow-md bg-card/30 backdrop-blur-sm overflow-hidden">
        <div className="tradingview-widget-container w-full h-[600px]">
          <iframe 
            src="https://www.tradingview.com/embed-widget/events/?locale=en#%7B%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A600%2C%22importanceFilter%22%3A%22all%22%2C%22currencyFilter%22%3A%5B%22USD%22%2C%22EUR%22%2C%22GBP%22%2C%22JPY%22%2C%22AUD%22%2C%22CAD%22%2C%22CHF%22%5D%7D"
            className="w-full h-full"
            frameBorder="0"
            allowTransparency={true}
            scrolling="no"
          />
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mt-4 text-center">
        Powered by TradingView. Times are displayed in your local timezone.
      </p>
    </div>
  );
};

export default EconomicCalendar;
