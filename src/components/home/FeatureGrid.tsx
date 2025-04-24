
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  LineChart, 
  PieChart, 
  Clock, 
  Gauge, 
  Scale, 
  BookOpen,
  Compass,
  GamepadIcon
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  animatedPreview: React.ReactNode;
  path: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  animatedPreview, 
  path, 
  index 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full overflow-hidden border border-white/10 backdrop-blur-sm bg-card/30 hover:shadow-[0_0_15px_rgba(123,97,255,0.3)] transition-all duration-500">
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-accent/20 p-2.5 rounded-lg text-accent">
              {icon}
            </div>
            <h3 className="font-medium text-lg">{title}</h3>
          </div>

          <p className="text-muted-foreground text-sm mb-4">{description}</p>
          
          <div className="flex-1 relative mb-4 rounded-lg overflow-hidden bg-background/50">
            {animatedPreview}
          </div>
          
          <Link to={path} className="w-full">
            <Button 
              variant="outline" 
              className="w-full border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              Try Now
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <Calculator className="h-5 w-5" />,
      title: "Forex Pip Calculator",
      description: "Instant profit/loss calculations for all major currency pairs.",
      path: "/forex-calculator",
      animatedPreview: (
        <div className="p-3 h-[120px] flex items-center justify-center">
          <motion.div 
            animate={{ 
              y: [0, -5, 0], 
              opacity: [1, 0.8, 1] 
            }} 
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-primary mb-1">+54.3 pips</div>
            <div className="text-xs text-muted-foreground">EURUSD @ 1.0845</div>
          </motion.div>
        </div>
      )
    },
    {
      icon: <LineChart className="h-5 w-5" />,
      title: "Crypto Calculator",
      description: "Smart profit tools for all major cryptocurrencies.",
      path: "/crypto-calculator",
      animatedPreview: (
        <div className="p-3 h-[120px] flex items-center justify-center">
          <motion.div 
            animate={{ 
              x: [-60, 60], 
              opacity: [0.2, 1, 0.2] 
            }} 
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative w-full"
          >
            <svg viewBox="0 0 100 30" className="w-full">
              <path
                d="M0,15 Q25,5 50,15 T100,15"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
              <circle cx="50" cy="15" r="3" fill="hsl(var(--primary))" />
            </svg>
            <div className="text-xs text-center text-muted-foreground mt-2">BTC/USDT</div>
          </motion.div>
        </div>
      )
    },
    {
      icon: <PieChart className="h-5 w-5" />,
      title: "Futures Calculator",
      description: "Precise calculations for futures trading and margin estimation.",
      path: "/futures-calculator",
      animatedPreview: (
        <div className="p-3 h-[120px] flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="w-20 h-20"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="hsl(var(--secondary))" strokeWidth="8" />
              <motion.path
                d="M50,10 A40,40 0 0,1 90,50"
                fill="transparent"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </div>
      )
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Session Clock",
      description: "Track forex sessions worldwide with precision timing.",
      path: "/session-clock",
      animatedPreview: (
        <div className="p-3 h-[120px] flex items-center justify-center">
          <motion.div 
            animate={{ 
              boxShadow: ['0 0 0px rgba(0,200,255,0)', '0 0 15px rgba(0,200,255,0.3)', '0 0 0px rgba(0,200,255,0)'] 
            }} 
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            className="flex flex-col items-center"
          >
            <div className="text-xs text-muted-foreground mb-1">LONDON</div>
            <div className="text-2xl font-bold">09:45:12</div>
            <motion.div 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-1 w-6 bg-primary mt-1.5 rounded-full"
            />
          </motion.div>
        </div>
      )
    },
    {
      icon: <Gauge className="h-5 w-5" />,
      title: "Currency Heatmap",
      description: "Visual strength indicators across major forex currencies.",
      path: "/currency-heatmap",
      animatedPreview: (
        <div className="p-3 h-[120px] flex items-center justify-center">
          <div className="grid grid-cols-3 grid-rows-3 gap-1 w-[120px]">
            {[0.8, 0.5, 0.3, 0.7, 0.9, 0.2, 0.4, 0.6, 0.1].map((value, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  backgroundColor: value > 0.5 
                    ? ['rgba(0,255,179,0.3)', 'rgba(0,255,179,0.5)', 'rgba(0,255,179,0.3)'] 
                    : ['rgba(255,100,100,0.3)', 'rgba(255,100,100,0.5)', 'rgba(255,100,100,0.3)'] 
                }}
                transition={{ duration: 1.5 + value, repeat: Infinity, repeatType: "reverse" }}
                className="aspect-square rounded-sm flex items-center justify-center text-xs font-mono"
              >
                {['EUR', 'USD', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'NZD', 'CNH'][i]}
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      icon: <Scale className="h-5 w-5" />,
      title: "Risk Management",
      description: "Optimize position sizing and risk per trade calculations.",
      path: "/risk-management",
      animatedPreview: (
        <div className="p-3 h-[120px] flex items-center justify-center">
          <motion.div 
            animate={{ y: [0, -5, 0] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-4">
              <motion.div 
                animate={{ height: ['20px', '40px', '20px'] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                style={{ width: '8px', borderRadius: '3px' }}
                className="bg-red-500"
              />
              <motion.div 
                animate={{ height: ['40px', '20px', '40px'] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                style={{ width: '8px', borderRadius: '3px' }}
                className="bg-green-500"
              />
            </div>
            <div className="text-xs text-muted-foreground mt-2">1:2.5 Risk:Reward</div>
          </motion.div>
        </div>
      )
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Trade Journal",
      description: "Log and analyze your trading performance over time.",
      path: "/trade-journal",
      animatedPreview: (
        <div className="p-3 h-[120px] flex items-center justify-center">
          <motion.div 
            animate={{ x: [0, 3, 0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full"
          >
            <div className="h-3 w-full bg-accent/20 rounded-sm mb-1.5"></div>
            <div className="h-3 w-4/5 bg-accent/20 rounded-sm mb-1.5"></div>
            <div className="h-3 w-5/6 bg-accent/20 rounded-sm mb-1.5"></div>
            <motion.div 
              animate={{ width: ['60%', '80%', '60%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="h-3 bg-primary/50 rounded-sm mb-1.5"
            ></motion.div>
            <div className="h-3 w-4/6 bg-accent/20 rounded-sm"></div>
          </motion.div>
        </div>
      )
    },
    {
      icon: <Compass className="h-5 w-5" />,
      title: "Daily Trade Tools",
      description: "Essential checklist and analysis tools for daily usage.",
      path: "/daily-trade-tools",
      animatedPreview: (
        <div className="p-3 h-[120px] flex items-center justify-center">
          <motion.div className="flex flex-col items-center">
            <div className="flex gap-2 mb-3">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0 }}
                className="h-5 w-5 rounded-sm border border-primary flex items-center justify-center"
              >
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="h-2.5 w-2.5 bg-primary rounded-sm"
                />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                className="h-5 w-5 rounded-sm border border-primary flex items-center justify-center"
              >
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="h-2.5 w-2.5 bg-primary rounded-sm"
                />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                className="h-5 w-5 rounded-sm border border-primary flex items-center justify-center"
              >
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  className="h-2.5 w-2.5 bg-primary rounded-sm"
                />
              </motion.div>
            </div>
            <div className="text-xs text-muted-foreground">Trade Checklist</div>
          </motion.div>
        </div>
      )
    },
    {
      icon: <GamepadIcon className="h-5 w-5" />,
      title: "Trader Game Center",
      description: "Improve trading skills with interactive game challenges.",
      path: "/trader-games",
      animatedPreview: (
        <div className="p-3 h-[120px] flex items-center justify-center">
          <motion.div 
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <motion.circle 
                cx="30" 
                cy="30" 
                r="25" 
                stroke="hsl(var(--primary))" 
                strokeWidth="2" 
                strokeDasharray="157"
                animate={{ 
                  strokeDashoffset: [157, 0, 157],
                  rotate: [0, 360, 0]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
              <circle cx="30" cy="30" r="5" fill="hsl(var(--primary))" />
            </svg>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold"
            >
              GO
            </motion.div>
          </motion.div>
        </div>
      )
    }
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <FeatureCard 
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          animatedPreview={feature.animatedPreview}
          path={feature.path}
          index={index}
        />
      ))}
    </div>
  );
};

export default FeatureGrid;
