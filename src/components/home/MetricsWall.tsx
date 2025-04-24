
import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  description: string;
  delay: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, suffix, description, delay }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smoother counting
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * end);
        
        setCount(current);
        
        if (progress === 1) {
          clearInterval(timer);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="p-6 neo-card rounded-xl hover:shadow-[0_0_15px_rgba(123,97,255,0.2)] transition-all duration-500"
    >
      <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-2">{title}</h3>
      
      <div className="flex items-baseline">
        <span className="text-4xl md:text-5xl font-bold text-primary neon-glow">
          {count.toLocaleString()}
        </span>
        {suffix && <span className="text-lg text-muted-foreground ml-1">{suffix}</span>}
      </div>
      
      <p className="text-sm mt-3 text-foreground/80">{description}</p>
    </motion.div>
  );
};

// Generate random trader feed data
const generateTraderFeed = () => {
  const locations = ['London', 'New York', 'Tokyo', 'Sydney', 'Frankfurt', 'Singapore', 'Dubai'];
  const actions = [
    'just completed 3 trades',
    'logged a winning trade',
    'saved a new checklist',
    'beat their high score',
    'reached a new milestone',
    'saved $2,400 in fees'
  ];
  
  return `Trader from ${locations[Math.floor(Math.random() * locations.length)]} ${
    actions[Math.floor(Math.random() * actions.length)]
  }`;
};

const MetricsWall: React.FC = () => {
  const [feed, setFeed] = useState<string[]>([
    generateTraderFeed(),
    generateTraderFeed(),
    generateTraderFeed()
  ]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFeed(prev => {
        const newFeed = [...prev];
        newFeed.pop();
        newFeed.unshift(generateTraderFeed());
        return newFeed;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get metrics from localStorage or use defaults if not present
  const getMetricFromStorage = (key: string, defaultValue: number) => {
    try {
      const value = localStorage.getItem(key);
      return value ? parseInt(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  };
  
  const checklistsSaved = getMetricFromStorage('checklist_count', 675);
  const journalEntries = getMetricFromStorage('journal_entries', 1240);
  const gameHighScore = getMetricFromStorage('killzone_highscore', 89);
  const communityMembers = 2800;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <MetricCard 
        title="Checklists Saved"
        value={checklistsSaved}
        description="This week by PipCraft traders"
        delay={0.1}
      />
      
      <MetricCard 
        title="Journal Entries"
        value={journalEntries}
        description="Trades logged by the community"
        delay={0.2}
      />
      
      <MetricCard 
        title="Kill Zone High Score"
        value={gameHighScore}
        suffix="ms"
        description="Fastest reaction time recorded"
        delay={0.3}
      />
      
      <MetricCard 
        title="Community"
        value={communityMembers}
        suffix="+"
        description="Traders using PipCraft daily"
        delay={0.4}
      />
      
      <div className="lg:col-span-4 mt-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="neo-card p-4 rounded-xl"
        >
          <h3 className="text-sm text-primary mb-3">Live Trader Activity</h3>
          <div className="space-y-3">
            {feed.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                <p className="text-sm text-foreground/90">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MetricsWall;
