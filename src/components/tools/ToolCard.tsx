
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tool } from '@/data/toolsData';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <div 
      id={tool.id}
      className="transition-all duration-500 rounded-lg"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Link to={tool.path}>
          <Card className="h-full overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-full bg-gradient-to-r from-neon-${tool.colorFrom} to-neon-${tool.colorTo} text-background`}>
                  <tool.icon className="h-5 w-5" />
                </div>
                
                {tool.badge && (
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    {tool.badge}
                  </Badge>
                )}
              </div>
              
              <h3 className="text-lg font-medium mb-1">{tool.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tool.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/30">
                <span className="text-xs text-muted-foreground">{tool.stats}</span>
                <Button size="sm" variant="ghost" className="group">
                  {tool.isExternal ? (
                    <>
                      Visit
                      <ExternalLink className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      Open
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </div>
  );
};

export default ToolCard;
