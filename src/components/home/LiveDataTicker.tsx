
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';

const LiveDataTicker: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        x: [0, -2000],
        transition: {
          x: {
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
          }
        }
      });
    }
  }, [controls, isInView]);

  // Generate fake forex data
  const forexPairs = [
    { pair: 'EUR/USD', value: '1.0845', change: '+0.05%', up: true },
    { pair: 'GBP/USD', value: '1.2723', change: '-0.12%', up: false },
    { pair: 'USD/JPY', value: '153.72', change: '+0.21%', up: true },
    { pair: 'USD/CAD', value: '1.3654', change: '+0.08%', up: true },
    { pair: 'AUD/USD', value: '0.6578', change: '-0.14%', up: false },
    { pair: 'NZD/USD', value: '0.5987', change: '-0.03%', up: false },
    { pair: 'USD/CHF', value: '0.9045', change: '+0.11%', up: true },
  ];

  // Sample news events
  const newsEvents = [
    { time: '10:30', title: 'US CPI Data Release', importance: 'high' },
    { time: '14:00', title: 'ECB Interest Rate Decision', importance: 'high' },
    { time: '15:30', title: 'Crude Oil Inventories', importance: 'medium' },
  ];

  // Trading tips
  const tradingTips = [
    "Always use a risk management strategy",
    "Set stop losses before entering a trade",
    "Trade with the trend, not against it",
    "Focus on quality trades over quantity",
    "Keep a detailed trading journal of all trades",
  ];

  return (
    <div ref={containerRef} className="w-full overflow-hidden py-4 relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-background to-transparent"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-background to-transparent"></div>
      
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={controls}
          className="flex gap-12 items-center"
          style={{ x: 0 }}
        >
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              {/* Forex Pairs */}
              {forexPairs.map((pair, index) => (
                <div key={`${i}-forex-${index}`} className="inline-flex items-center gap-2">
                  <div className="font-medium text-sm">{pair.pair}</div>
                  <div className="font-mono text-sm">{pair.value}</div>
                  <div className={`text-xs ${pair.up ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                    {pair.up ? (
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-0.5" />
                    )}
                    {pair.change}
                  </div>
                </div>
              ))}
              
              {/* Divider */}
              <div className="h-4 w-px bg-border"></div>
              
              {/* News Events */}
              <div className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Upcoming Events:</span>
              </div>
              
              {newsEvents.map((event, index) => (
                <div key={`${i}-event-${index}`} className="inline-flex items-center">
                  <div className="bg-accent/20 px-2 py-0.5 rounded text-xs font-mono">{event.time}</div>
                  <div className="text-sm ml-2">{event.title}</div>
                  <div className={`ml-2 h-2 w-2 rounded-full ${
                    event.importance === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
              ))}
              
              {/* Divider */}
              <div className="h-4 w-px bg-border"></div>
              
              {/* Trading Tip */}
              <div className="inline-flex items-center gap-2">
                <div className="text-primary text-sm font-medium">Tip of the day:</div>
                <div className="text-sm">{tradingTips[i % tradingTips.length]}</div>
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LiveDataTicker;
