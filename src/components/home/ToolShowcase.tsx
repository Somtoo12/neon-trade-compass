
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  Scale, 
  BookOpen, 
  ClipboardCheck, 
  Calendar,
  Clock, 
  Bitcoin,
  Grid3X3, 
  GamepadIcon
} from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tools = [
  {
    name: 'Forex Pip Calculator',
    icon: <Calculator className="h-6 w-6 text-neon-green" />,
    summary: 'Calculate pip values for any position size',
    path: '/forex-calculator'
  },
  {
    name: 'Risk Management',
    icon: <TrendingUp className="h-6 w-6 text-neon-blue" />,
    summary: 'Protect your capital with smart risk analysis',
    path: '/risk-management'
  },
  {
    name: 'Max Lot Size',
    icon: <Scale className="h-6 w-6 text-neon-purple" />,
    summary: 'Calculate optimal position sizes for your risk',
    path: '/max-lot-size'
  },
  {
    name: 'Trade Journal',
    icon: <BookOpen className="h-6 w-6 text-neon-green" />,
    summary: 'Track your trades and analyze performance',
    path: '/trade-journal'
  },
  {
    name: 'Challenge Blueprint',
    icon: <ClipboardCheck className="h-6 w-6 text-neon-blue" />,
    summary: 'Master prop firm challenges with precision',
    path: '/challenge-blueprint'
  },
  {
    name: 'Daily Trade Tools',
    icon: <TrendingUp className="h-6 w-6 text-neon-purple" />,
    summary: 'Essential tools for your daily trading routine',
    path: '/daily-trade-tools'
  },
  {
    name: 'Session Clock',
    icon: <Clock className="h-6 w-6 text-neon-green" />,
    summary: 'Track trading sessions around the world',
    path: '/session-clock'
  },
  {
    name: 'Economic Calendar',
    icon: <Calendar className="h-6 w-6 text-neon-blue" />,
    summary: 'Stay ahead of market-moving events',
    path: '/economic-calendar'
  },
  {
    name: 'Futures Calculator',
    icon: <TrendingUp className="h-6 w-6 text-neon-purple" />,
    summary: 'Calculate futures contract values and risk',
    path: '/futures-calculator'
  },
  {
    name: 'Crypto Calculator',
    icon: <Bitcoin className="h-6 w-6 text-neon-green" />,
    summary: 'Optimize your crypto positions',
    path: '/crypto-calculator'
  },
  {
    name: 'Currency Heatmap',
    icon: <Grid3X3 className="h-6 w-6 text-neon-blue" />,
    summary: 'Visualize currency strength across markets',
    path: '/currency-heatmap'
  },
  {
    name: 'Trader Game Center',
    icon: <GamepadIcon className="h-6 w-6 text-neon-purple" />,
    summary: 'Train trading skills through interactive games',
    path: '/trader-games'
  }
];

const ToolShowcase: React.FC = () => {
  const [autoScroll, setAutoScroll] = useState(true);
  
  return (
    <section className="py-12 bg-gradient-to-r from-background via-accent/5 to-background">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Trading Tools
          </span> at Your Fingertips
        </motion.h2>

        <div className="relative">
          <Carousel 
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
              containScroll: false
            }}
            className="w-full"
          >
            <CarouselContent className="py-4">
              {tools.map((tool, index) => (
                <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4">
                  <motion.div 
                    className="h-full"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className="h-full border border-accent/10 bg-card/30 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 flex flex-col">
                      <div className="p-6 flex flex-col h-full justify-between">
                        <div>
                          <div className="mb-3 flex justify-center">
                            <div className="p-3 rounded-full bg-accent/10">
                              {tool.icon}
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-center">{tool.name}</h3>
                          <p className="text-sm text-muted-foreground text-center mb-4">{tool.summary}</p>
                        </div>
                        <Link to={tool.path}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full bg-card hover:bg-accent/10 border-accent/20"
                          >
                            Launch Tool
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ToolShowcase;
