
import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Calendar, Brain, Gamepad, Clock, LineChart, BookOpen, Trophy } from 'lucide-react';

const features = [
  { icon: <Calculator className="h-4 w-4" />, label: "Forex Pip Calculator" },
  { icon: <LineChart className="h-4 w-4" />, label: "Futures Tools" },
  { icon: <BookOpen className="h-4 w-4" />, label: "Trading Journal" },
  { icon: <Trophy className="h-4 w-4" />, label: "Prop Challenge Simulator" },
  { icon: <Brain className="h-4 w-4" />, label: "Risk Management" },
  { icon: <Gamepad className="h-4 w-4" />, label: "Game Center" },
  { icon: <Calendar className="h-4 w-4" />, label: "News Calendar" },
  { icon: <Clock className="h-4 w-4" />, label: "Session Clock" },
];

const FeatureMarquee = () => {
  return (
    <div className="w-full overflow-hidden py-6 bg-gradient-to-r from-background via-accent/5 to-background">
      <motion.div 
        className="flex gap-4 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {[...features, ...features].map((feature, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/40 border border-accent/20 backdrop-blur-sm"
          >
            {feature.icon}
            <span className="text-sm font-medium text-foreground/80">{feature.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeatureMarquee;
