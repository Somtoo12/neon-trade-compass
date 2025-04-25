
import React from 'react';
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
  Grid3X3
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const categories = [
  {
    title: 'Calculators & Risk',
    tools: [
      {
        name: 'Forex Pip Calculator',
        icon: <Calculator className="h-5 w-5 text-neon-green" />,
        summary: 'Calculate pip values for any position size',
        path: '/forex-calculator'
      },
      {
        name: 'Max Lot Size',
        icon: <Scale className="h-5 w-5 text-neon-purple" />,
        summary: 'Calculate optimal position sizes for your risk',
        path: '/max-lot-size'
      },
      {
        name: 'Risk Management',
        icon: <TrendingUp className="h-5 w-5 text-neon-blue" />,
        summary: 'Protect your capital with smart risk analysis',
        path: '/risk-management'
      },
      {
        name: 'Crypto Calculator',
        icon: <Bitcoin className="h-5 w-5 text-neon-green" />,
        summary: 'Optimize your crypto positions',
        path: '/crypto-calculator'
      },
      {
        name: 'Futures Calculator',
        icon: <TrendingUp className="h-5 w-5 text-neon-purple" />,
        summary: 'Calculate futures contract values and risk',
        path: '/futures-calculator'
      }
    ]
  },
  {
    title: 'Planning & Tracking',
    tools: [
      {
        name: 'Challenge Blueprint',
        icon: <ClipboardCheck className="h-5 w-5 text-neon-blue" />,
        summary: 'Master prop firm challenges with precision',
        path: '/challenge-blueprint'
      },
      {
        name: 'Daily Trade Tools',
        icon: <TrendingUp className="h-5 w-5 text-neon-purple" />,
        summary: 'Essential tools for your daily trading routine',
        path: '/daily-trade-tools'
      },
      {
        name: 'Trade Journal',
        icon: <BookOpen className="h-5 w-5 text-neon-green" />,
        summary: 'Track your trades and analyze performance',
        path: '/trade-journal'
      }
    ]
  },
  {
    title: 'Market Awareness',
    tools: [
      {
        name: 'Session Clock',
        icon: <Clock className="h-5 w-5 text-neon-green" />,
        summary: 'Track trading sessions around the world',
        path: '/session-clock'
      },
      {
        name: 'Economic Calendar',
        icon: <Calendar className="h-5 w-5 text-neon-blue" />,
        summary: 'Stay ahead of market-moving events',
        path: '/economic-calendar'
      },
      {
        name: 'Currency Heatmap',
        icon: <Grid3X3 className="h-5 w-5 text-neon-purple" />,
        summary: 'Visualize currency strength across markets',
        path: '/currency-heatmap'
      }
    ]
  }
];

const ToolCategories: React.FC = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          Tool Categories
        </motion.h2>
        
        <motion.p
          className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          All the tools you need, organized for your trading workflow
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 * categoryIndex }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border-accent/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-neon-green to-neon-purple bg-clip-text text-transparent">
                    {category.title}
                  </h3>
                  
                  <div className="space-y-4">
                    {category.tools.map((tool, toolIndex) => (
                      <motion.div
                        key={tool.name}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.1 * toolIndex }}
                        whileHover={{ x: 5 }}
                      >
                        <Link to={tool.path} className="block">
                          <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/10 transition-all">
                            <div className="p-2 rounded-full bg-accent/10 flex-shrink-0">
                              {tool.icon}
                            </div>
                            <div className="flex-grow">
                              <h4 className="text-sm font-medium">{tool.name}</h4>
                              <p className="text-xs text-muted-foreground">{tool.summary}</p>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1, x: 3 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                                <TrendingUp className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolCategories;
