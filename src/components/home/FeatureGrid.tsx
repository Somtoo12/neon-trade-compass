import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Scale,
  LineChart,
  Calendar,
  Clock,
  FileText
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  animatedPreview: React.ReactNode;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  animatedPreview, 
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
        </div>
      </Card>
    </motion.div>
  );
};

const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <Calculator className="h-5 w-5" />,
      title: "Pip Calculator",
      description: "Instant profit/loss calculations for all major currency pairs.",
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
      icon: <Scale className="h-5 w-5" />,
      title: "Risk Manager",
      description: "Smart risk management tools for optimal trading decisions.",
      animatedPreview: (
        <div className="p-3 h-[120px] flex items-center justify-center">
          <motion.div 
            animate={{ 
              rotate: 360 
            }} 
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
      icon: <LineChart className="h-5 w-5" />,
      title: "Max Lot Size",
      description: "Calculate optimal position sizes based on your risk parameters.",
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
            <div className="text-xs text-center text-muted-foreground mt-2">Position Size</div>
          </motion.div>
        </div>
      )
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Economic Calendar",
      description: "Stay informed with real-time economic event tracking.",
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
            </div>
            <div className="text-xs text-muted-foreground">Market Events</div>
          </motion.div>
        </div>
      )
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Blueprint",
      description: "Master prop firm challenges with precision planning.",
      animatedPreview: (
        <div className="p-3 h-[120px] flex items-center justify-center">
          <motion.div className="w-full">
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
      icon: <Clock className="h-5 w-5" />,
      title: "Session Clock",
      description: "Track forex sessions worldwide with precision timing.",
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
          index={index}
        />
      ))}
    </div>
  );
};

export default FeatureGrid;
