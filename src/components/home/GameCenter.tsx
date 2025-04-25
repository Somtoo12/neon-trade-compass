
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GamepadIcon, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GameCenter: React.FC = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="rounded-2xl bg-gradient-to-br from-neon-purple/20 via-neon-blue/10 to-neon-green/20 backdrop-blur-md border border-white/10 p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div 
                  key={i} 
                  className="absolute w-1 h-1 rounded-full bg-neon-purple"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{ 
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="p-4 rounded-full bg-neon-purple/20 backdrop-blur-sm border border-white/10">
                <GamepadIcon className="h-12 w-12 text-neon-purple" />
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <span className="text-2xl mr-2">🎮</span>
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
                    Trader Game Center
                  </h2>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Train your discipline, strategy, and speed through fun trading mini-games.
                </p>
                
                <Link to="/trader-games">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      className="group relative px-6 py-2 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple text-white font-medium transition-all duration-500"
                      size="lg"
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      Enter Game Mode
                      <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute inset-0 bg-white/10 rounded-md blur-sm"></div>
                      </div>
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GameCenter;
