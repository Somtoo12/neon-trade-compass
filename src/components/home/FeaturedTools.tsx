
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, BookOpen, ClipboardCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const featuredTools = [
  {
    name: 'Max Lot Size Calculator',
    icon: <Scale className="h-8 w-8" />,
    description: 'Calculate optimal position sizes based on account equity and risk tolerance',
    path: '/max-lot-size',
    badge: '🔥 Most Used',
    color: 'from-neon-green to-neon-blue',
    stat: '2,500+ daily calculations',
    tooltip: 'Pip calculator with lot size and leverage input'
  },
  {
    name: 'Trade Journal',
    icon: <BookOpen className="h-8 w-8" />,
    description: 'Track your trades and analyze performance patterns to improve profitability',
    path: '/trade-journal',
    badge: '🧠 Smart Pick',
    color: 'from-neon-blue to-neon-purple',
    stat: 'Improves win rate by 28%'
  },
  {
    name: 'Challenge Blueprint',
    icon: <ClipboardCheck className="h-8 w-8" />,
    description: 'Strategic planner to help you pass prop firm challenges with confidence',
    path: '/challenge-blueprint',
    badge: '💥 Trending',
    color: 'from-neon-purple to-neon-green',
    stat: '89% success rate'
  }
];

const FeaturedTools: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background via-accent/5 to-background">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          Featured Tools
        </motion.h2>
        
        <motion.p
          className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Our most popular tools that traders rely on daily
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="h-full"
            >
              <Link to={tool.path} className="block h-full" title={tool.tooltip || tool.name}>
                <Card className={`h-full bg-card/50 backdrop-blur-sm overflow-hidden relative group border-0 shadow-lg`}>
                  <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${tool.color} group-hover:opacity-30 transition-opacity duration-300`}></div>
                  <div className={`absolute inset-0 opacity-10 border-2 border-transparent bg-clip-padding group-hover:border-gradient-${index}`} style={{
                    borderImage: `linear-gradient(to right, ${index === 0 ? 'var(--neon-green), var(--neon-blue)' : index === 1 ? 'var(--neon-blue), var(--neon-purple)' : 'var(--neon-purple), var(--neon-green)'})`,
                    borderImageSlice: 1
                  }}></div>
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${tool.color}`}>
                        {tool.icon}
                      </div>
                      <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-0">
                        {tool.badge}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">{tool.description}</p>
                    
                    <div className="pt-4 mt-auto border-t border-accent/10">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-accent/80">{tool.stat}</span>
                        <motion.div
                          whileHover={{ scale: 1.05, x: 3 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button size="sm" variant="ghost" className="group-hover:bg-accent/20">
                            Open Tool
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTools;
